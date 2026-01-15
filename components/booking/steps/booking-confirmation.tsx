"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingConfirmationProps {
  bookingId: string;
}

export function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = bookingId.startsWith("demo-");

  useEffect(() => {
    async function loadBooking() {
      // Skip API call in demo mode
      if (isDemo) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error loading booking:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingId, isDemo]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">
        {isDemo ? "Demo Booking Complete!" : "Booking Confirmed!"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {isDemo
          ? "This is a demo booking. Connect a database to enable real bookings."
          : `We've sent a confirmation email to ${booking?.customer_email}`}
      </p>

      {isDemo ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
          <h4 className="font-bold mb-4 text-blue-900 dark:text-blue-200">
            Demo Mode
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            You just completed the full booking flow! This demonstrates:
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li>✓ Service selection</li>
            <li>✓ Date and time picker</li>
            <li>✓ Customer information form</li>
            <li>✓ Payment method selection</li>
            <li>✓ Booking confirmation</li>
          </ul>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">
            To enable real bookings, connect your Supabase database.
          </p>
        </div>
      ) : (
        booking && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
            <h4 className="font-bold mb-4">Booking Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Booking ID:
                </span>
                <span className="font-medium">{bookingId.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium">
                  {new Date(booking.starts_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="font-medium">
                  {new Date(booking.starts_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span className="font-medium capitalize">{booking.status}</span>
              </div>
            </div>
          </div>
        )
      )}

      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You can cancel this booking up to 24 hours before the appointment
          using the link in your confirmation email.
        </p>
        <Link href="/">
          <Button variant="outline" className="w-full max-w-md">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
