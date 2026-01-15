"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { BookingData } from "../booking-widget";

interface PaymentSelectionProps {
  barberId: string;
  bookingData: BookingData;
  onSuccess: (bookingId: string) => void;
  onBack: () => void;
}

// Check if in demo mode
const isDemoMode = () => {
  if (typeof window === "undefined") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("placeholder");
};

export function PaymentSelection({
  barberId,
  bookingData,
  onSuccess,
  onBack,
}: PaymentSelectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<"on-site" | "online">(
    "on-site"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isDemo = isDemoMode();

  const handleCreateBooking = async () => {
    setLoading(true);
    setError("");

    // Demo mode - simulate booking
    if (isDemo) {
      setTimeout(() => {
        onSuccess("demo-booking-" + Date.now());
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          barberId,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      if (paymentMethod === "online" && data.paymentUrl) {
        // Redirect to Stripe payment
        window.location.href = data.paymentUrl;
      } else {
        onSuccess(data.bookingId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-bold">Payment Method</h3>
      </div>

      {isDemo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Demo Mode:</strong> This booking won't be saved. Connect a
            database for real bookings.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input
              type="radio"
              name="paymentMethod"
              value="on-site"
              checked={paymentMethod === "on-site"}
              onChange={() => setPaymentMethod("on-site")}
              disabled={loading}
            />
            <div>
              <div className="font-medium">Pay at the shop</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pay cash or card when you arrive
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
              disabled={loading}
            />
            <div>
              <div className="font-medium">Pay online now</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Secure payment via Stripe
              </div>
            </div>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleCreateBooking}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
