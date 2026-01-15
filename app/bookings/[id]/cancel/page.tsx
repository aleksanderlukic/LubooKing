"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface BookingCancelPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingCancelPage({ params }: BookingCancelPageProps) {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      const tokenParam = searchParams.get("token");

      setBookingId(resolvedParams.id);
      setToken(tokenParam || "");

      if (!tokenParam) {
        setError("Invalid cancellation link");
        setLoading(false);
        return;
      }

      // Load booking details
      try {
        const response = await fetch(`/api/bookings/${resolvedParams.id}`);
        const data = await response.json();

        if (data.status === "cancelled") {
          setCancelled(true);
        }

        setBooking(data);
      } catch (err) {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [params, searchParams]);

  const handleCancel = async () => {
    setCancelling(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      setCancelled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {error || "This booking link is invalid or has expired."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cancelled || booking.status === "cancelled") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Booking Cancelled</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your booking has been successfully cancelled. You'll receive a
                confirmation email shortly.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Cancel Booking</h1>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Are you sure you want to cancel this booking?
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This action cannot be undone. You'll receive a confirmation
                    email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Service:
                  </span>
                  <span className="font-medium">{booking.services?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Barber:
                  </span>
                  <span className="font-medium">
                    {booking.barbers?.shop_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="font-medium">
                    {new Date(booking.starts_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Time:
                  </span>
                  <span className="font-medium">
                    {new Date(booking.starts_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.close()}
                disabled={cancelling}
              >
                No, Keep Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
