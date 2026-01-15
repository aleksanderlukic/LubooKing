import { redirect } from "next/navigation";
import {
  IS_SINGLE_MODE,
  SINGLE_BARBER_SLUG,
  IS_MARKETPLACE_MODE,
} from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Scissors } from "lucide-react";

import { Database } from "@/lib/supabase/database.types";

type Barber = Database["public"]["Tables"]["barbers"]["Row"];

async function getBarbers(): Promise<Barber[]> {
  const supabase = await createClient();
  const { data: barbers } = await supabase
    .from("barbers")
    .select("*")
    .order("shop_name");

  return barbers || [];
}

export default async function HomePage() {
  // In single mode, redirect to the single barber profile
  if (IS_SINGLE_MODE) {
    redirect(`/barbers/${SINGLE_BARBER_SLUG}`);
  }

  // Marketplace mode: show all barbers
  const barbers = await getBarbers();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Barber
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse professional barbers in your area and book your next
            appointment with ease
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Scissors className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No barbers available yet. Check back soon!
              </p>
            </div>
          ) : (
            barbers.map((barber) => (
              <Link
                key={barber.id}
                href={`/barbers/${barber.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Logo */}
                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                    {barber.logo_url ? (
                      <Image
                        src={barber.logo_url}
                        alt={barber.shop_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Scissors className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {barber.shop_name}
                    </h3>
                    {(barber.city || barber.address) && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {barber.city && barber.address
                            ? `${barber.address}, ${barber.city}`
                            : barber.city || barber.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
