import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/validations";
import { generateCancellationToken } from "@/lib/utils/booking";
import { Database } from "@/lib/supabase/database.types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get base URL from request
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Validate input
    const validated = bookingSchema.parse(body);

    const supabase = await createClient();

    // Generate cancellation token
    const cancellationToken = generateCancellationToken();

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      // @ts-expect-error Supabase type inference issue
      .insert({
        barber_id: validated.barberId,
        service_id: validated.serviceId,
        starts_at: validated.startsAt,
        ends_at: validated.endsAt,
        customer_name: validated.customerName,
        customer_email: validated.customerEmail,
        customer_phone: validated.customerPhone,
        location_type: validated.locationType,
        customer_address: validated.customerAddress || null,
        payment_method: validated.paymentMethod,
        payment_status:
          validated.paymentMethod === "on-site" ? "pending" : "pending",
        status: "booked",
        cancellation_token: cancellationToken,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Booking error:", bookingError);
      return NextResponse.json(
        {
          error:
            "Failed to create booking. Time slot may no longer be available.",
        },
        { status: 400 },
      );
    }

    const typedBooking = booking as Booking;

    // If online payment, create payment intent and return URL
    if (validated.paymentMethod === "online") {
      // Get service price
      const { data: service } = await supabase
        .from("services")
        .select("price")
        .eq("id", validated.serviceId)
        .single();

      if (service) {
        // Create Stripe checkout session
        const checkoutResponse = await fetch(`${baseUrl}/api/stripe/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: typedBooking.id }),
        });

        if (checkoutResponse.ok) {
          const { url } = await checkoutResponse.json();
          return NextResponse.json({
            bookingId: typedBooking.id,
            paymentUrl: url,
          });
        }
      }
    }

    // Send confirmation email
    await fetch(`${baseUrl}/api/emails/booking-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: typedBooking.id }),
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    return NextResponse.json({ bookingId: typedBooking.id });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
