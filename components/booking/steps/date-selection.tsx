"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfToday, parseISO } from "date-fns";
import { ChevronLeft } from "lucide-react";

interface DateSelectionProps {
  barberId: string;
  serviceId: string;
  selectedDate?: string;
  onSelect: (date: string) => void;
  onBack: () => void;
}

export function DateSelection({
  barberId,
  serviceId,
  selectedDate,
  onSelect,
  onBack,
}: DateSelectionProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvailableDates() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/availability/dates?barberId=${barberId}&serviceId=${serviceId}`
        );
        const data = await response.json();
        setAvailableDates(data.dates || []);
      } catch (error) {
        console.error("Error loading dates:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAvailableDates();
  }, [barberId, serviceId]);

  // Generate next 30 days
  const today = startOfToday();
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-bold">Select a Date</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading available dates...
          </p>
        </div>
      ) : availableDates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No available dates at this time. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {dates.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const isAvailable = availableDates.includes(dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                disabled={!isAvailable}
                onClick={() => isAvailable && onSelect(dateStr)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : isAvailable
                      ? "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      : "border-gray-200 dark:border-gray-800 opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {format(date, "EEE")}
                </div>
                <div className="text-lg font-bold">{format(date, "d")}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {format(date, "MMM")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
