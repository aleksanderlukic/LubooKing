"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate, formatTimeSlot } from "@/lib/utils/booking";

interface Booking {
  id: string;
  starts_at: string;
  ends_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  services: { title: string };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState<string>("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const supabase = createClient();

    // Get current user's barber profile
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: barber } = await supabase
      .from("barbers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!barber) return;

    const typedBarber = barber as { id: string };
    setBarberId(typedBarber.id);

    // Get bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        `
        *,
        services(title)
      `
      )
      .eq("barber_id", typedBarber.id)
      .order("starts_at", { ascending: false });

    setBookings(bookings || []);
    setLoading(false);
  }

  async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from("bookings")
      // @ts-expect-error Supabase type inference issue
      .update({ status })
      .eq("id", bookingId);

    if (!error) {
      loadBookings();
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No bookings yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          {booking.services.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === "booked"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : booking.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <strong>Customer:</strong> {booking.customer_name}
                        </p>
                        <p>
                          <strong>Email:</strong> {booking.customer_email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {booking.customer_phone}
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(booking.starts_at)}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {formatTimeSlot(booking.starts_at, booking.ends_at)}
                        </p>
                      </div>
                    </div>

                    {booking.status === "booked" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateBookingStatus(booking.id, "completed")
                          }
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateBookingStatus(booking.id, "no-show")
                          }
                        >
                          No-show
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
