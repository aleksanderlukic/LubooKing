"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function PaymentStatusHandler() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"success" | "cancelled" | null>(null);
  const bookingId = searchParams.get("booking");
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (bookingId && paymentStatus) {
      setStatus(paymentStatus as "success" | "cancelled");
      setIsVisible(true);

      // Auto hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete("booking");
        url.searchParams.delete("payment");
        window.history.replaceState({}, "", url.toString());
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [bookingId, paymentStatus]);

  if (!isVisible || !status) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      {status === "success" ? (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900 dark:text-green-100">
                Payment Successful!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your booking has been confirmed. Check your email for details.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-green-600 hover:text-green-800 ml-auto"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-100">
                Payment Cancelled
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your booking is on hold. Complete payment to confirm your
                appointment.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-amber-600 hover:text-amber-800 ml-auto"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
