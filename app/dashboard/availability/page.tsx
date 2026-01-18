"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Availability {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DashboardAvailabilityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key: string]: { enabled: boolean; start: string; end: string };
  }>({
    Monday: { enabled: true, start: "09:00", end: "17:00" },
    Tuesday: { enabled: true, start: "09:00", end: "17:00" },
    Wednesday: { enabled: true, start: "09:00", end: "17:00" },
    Thursday: { enabled: true, start: "09:00", end: "17:00" },
    Friday: { enabled: true, start: "09:00", end: "17:00" },
    Saturday: { enabled: false, start: "10:00", end: "14:00" },
    Sunday: { enabled: false, start: "10:00", end: "14:00" },
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: barber } = await (supabase.from("barbers") as any)
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!barber) throw new Error("No barber profile found");

      setBarberId(barber.id);
      await loadAvailability(barber.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailability(id: string) {
    const { data, error } = await (supabase.from("availability") as any)
      .select("*")
      .eq("barber_id", id)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(30);

    if (error) throw error;
    setAvailability(data || []);
  }

  async function generateWeeklySchedule() {
    setSaving(true);
    setError("");

    try {
      const today = new Date();
      const entries = [];

      // Generate for next 4 weeks
      for (let i = 0; i < 28; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayName =
          DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const schedule = weeklySchedule[dayName];

        if (schedule.enabled) {
          entries.push({
            barber_id: barberId,
            date: date.toISOString().split("T")[0],
            start_time: schedule.start,
            end_time: schedule.end,
          });
        }
      }

      if (entries.length === 0) {
        setError("Please enable at least one day in your weekly schedule");
        setSaving(false);
        return;
      }

      // Delete existing future availability
      await (supabase.from("availability") as any)
        .delete()
        .eq("barber_id", barberId)
        .gte("date", today.toISOString().split("T")[0]);

      // Insert new availability
      const { error } = await (supabase.from("availability") as any).insert(
        entries
      );

      if (error) throw error;

      await loadAvailability(barberId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteAvailability(id: string) {
    try {
      const { error } = await (supabase.from("availability") as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadAvailability(barberId);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Set Availability</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Weekly Schedule Template */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Weekly Schedule Template
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Set your typical working hours. This will generate availability for
            the next 4 weeks.
          </p>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded"
              >
                <input
                  type="checkbox"
                  checked={weeklySchedule[day].enabled}
                  onChange={(e) =>
                    setWeeklySchedule({
                      ...weeklySchedule,
                      [day]: {
                        ...weeklySchedule[day],
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="w-24 font-medium">{day}</span>
                {weeklySchedule[day].enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={weeklySchedule[day].start}
                      onChange={(e) =>
                        setWeeklySchedule({
                          ...weeklySchedule,
                          [day]: {
                            ...weeklySchedule[day],
                            start: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-1 border rounded dark:bg-gray-800"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={weeklySchedule[day].end}
                      onChange={(e) =>
                        setWeeklySchedule({
                          ...weeklySchedule,
                          [day]: {
                            ...weeklySchedule[day],
                            end: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-1 border rounded dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={generateWeeklySchedule}
            disabled={saving}
            className="w-full mt-4"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Generate Availability (Next 4 Weeks)
              </>
            )}
          </Button>
        </div>

        {/* Current Availability */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Current Availability</h2>

          {availability.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No availability set. Use the weekly schedule template above to
                generate your availability.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availability.map((slot) => {
                const date = new Date(slot.date + "T00:00:00");
                const dayName =
                  DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1];

                return (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div>
                      <span className="font-medium">{dayName}</span>
                      <span className="mx-2">•</span>
                      <span>{slot.date}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteAvailability(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
