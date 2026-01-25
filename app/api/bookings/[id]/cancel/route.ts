import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canCancelBooking } from "@/lib/utils/booking";
import { Database } from "@/lib/supabase/database.types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { token } = await request.json();

    // Get base URL from request
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    if (!token) {
      return NextResponse.json(
        { error: "Cancellation token is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("cancellation_token", token)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or invalid cancellation token" },
        { status: 404 },
      );
    }

    const typedBooking = booking as Booking;

    // Check if already cancelled
    if (typedBooking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 },
      );
    }

    // Check if can be cancelled (24 hour rule)
    if (!canCancelBooking(typedBooking.starts_at)) {
      return NextResponse.json(
        {
          error:
            "Bookings can only be cancelled at least 24 hours before the appointment",
        },
        { status: 400 },
      );
    }

    // Cancel booking
    const { error: updateError } = await supabase
      .from("bookings")
      // @ts-expect-error Supabase type inference issue
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw updateError;
    }

    // Send cancellation email
    await fetch(`${baseUrl}/api/emails/booking-cancellation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    }).catch((err) => console.error("Failed to send cancellation email:", err));

    // Notify subscribers about available slot
    await fetch(`${baseUrl}/api/notifications/slot-available`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    }).catch((err) => console.error("Failed to notify subscribers:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
