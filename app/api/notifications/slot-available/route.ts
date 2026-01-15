import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type BookingWithRelations = {
  barber_id: string;
  starts_at: string;
  barbers: { shop_name: string };
};

type Subscriber = {
  subscriber_email: string;
};

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    const supabase = await createClient();

    // Get booking details
    const { data: booking } = await supabase
      .from("bookings")
      .select(
        `
        *,
        services(title),
        barbers(shop_name)
      `
      )
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const typedBooking = booking as unknown as BookingWithRelations;

    // Get subscribers for this barber
    const { data: subscribers } = await supabase
      .from("notification_subscriptions")
      .select("subscriber_email")
      .eq("barber_id", typedBooking.barber_id)
      .eq("active", true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers to notify" });
    }

    const typedSubscribers = subscribers as Subscriber[];

    // Send notification emails
    const emailPromises = typedSubscribers.map((sub) =>
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/slot-available`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sub.subscriber_email,
          barberName: typedBooking.barbers.shop_name,
          date: typedBooking.starts_at,
        }),
      })
    );

    await Promise.allSettled(emailPromises);

    return NextResponse.json({ message: "Notifications sent" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
