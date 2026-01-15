import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { format, addDays } from "date-fns";
import { Database } from "@/lib/supabase/database.types";

type Availability = Database["public"]["Tables"]["availability"]["Row"];

// Check if in demo mode
const isDemoMode = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("placeholder");
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get("barberId");
    const serviceId = searchParams.get("serviceId");

    if (!barberId || !serviceId) {
      return NextResponse.json(
        { error: "barberId and serviceId are required" },
        { status: 400 }
      );
    }

    // Demo mode - return next 14 days
    if (isDemoMode()) {
      const dates: string[] = [];
      for (let i = 1; i <= 14; i++) {
        dates.push(format(addDays(new Date(), i), "yyyy-MM-dd"));
      }
      return NextResponse.json({ dates });
    }

    const supabase = await createClient();

    // Get all availability for this barber (future dates only)
    const today = format(new Date(), "yyyy-MM-dd");
    const { data: availability } = await supabase
      .from("availability")
      .select("date")
      .eq("barber_id", barberId)
      .gte("date", today)
      .order("date");

    // Extract unique dates
    const typedAvailability = (availability || []) as Availability[];
    const dates = [...new Set(typedAvailability.map((a) => a.date))];

    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
