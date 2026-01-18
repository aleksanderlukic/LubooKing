import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, Package } from "lucide-react";
import { Database } from "@/lib/supabase/database.types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Barber = Database["public"]["Tables"]["barbers"]["Row"];

async function getDashboardStats(barberId: string) {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("barber_id", barberId);

  const typedBookings = (bookings || []) as Booking[];

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("barber_id", barberId);

  const typedServices = (services || []) as Service[];
  const activeServices = typedServices.filter((s) => s.active);

  const today = new Date().toISOString();
  const todayBookings = typedBookings.filter(
    (b) =>
      b.starts_at.startsWith(today.split("T")[0]) && b.status !== "cancelled"
  ).length;

  const totalRevenue = typedBookings
    .filter((b) => b.payment_status === "completed")
    .reduce((sum, b) => {
      const service = typedServices.find((s) => s.id === b.service_id);
      return sum + (service?.price || 0);
    }, 0);

  return {
    totalBookings: typedBookings.filter((b) => b.status !== "cancelled").length,
    todayBookings,
    totalServices: activeServices.length,
    totalRevenue,
  };
}

async function getBarber(userId: string): Promise<Barber | null> {
  const supabase = await createClient();

  const { data: barber } = await supabase
    .from("barbers")
    .select("*")
    .eq("user_id", userId)
    .single();

  return barber as Barber | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const barber = await getBarber(user.id);

  if (!barber) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            Set Up Your Barber Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to create a barber profile before you can access the
            dashboard.
          </p>
          <Link
            href="/dashboard/setup"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  const stats = await getDashboardStats(barber.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {barber.shop_name}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Today's Bookings
                  </p>
                  <p className="text-2xl font-bold">{stats.todayBookings}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Active Services
                  </p>
                  <p className="text-2xl font-bold">{stats.totalServices}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">Manage Bookings</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and update booking statuses
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/services">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">Manage Services</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add, edit, or remove services
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/availability">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">Set Availability</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your working hours
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">Profile Settings</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your shop information
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/gallery">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">Gallery</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your portfolio images
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/barbers/${barber.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <h3 className="text-lg font-bold">View Public Profile</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See how customers see your profile
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
