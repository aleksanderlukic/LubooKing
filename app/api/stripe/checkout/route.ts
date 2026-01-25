import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    // Get base URL from request
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const supabase = await createClient();

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(
        `
        *,
        service:services(title, price),
        barber:barbers(shop_name, slug)
      `,
      )
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Type assertion for joined data
    const bookingWithRelations = booking as any;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "swish"],
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: bookingWithRelations.service.title,
              description: `Booking at ${bookingWithRelations.barber.shop_name}`,
            },
            unit_amount: Math.round(bookingWithRelations.service.price * 100), // Convert to öre
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/barbers/${bookingWithRelations.barber.slug}?booking=${bookingId}&payment=success`,
      cancel_url: `${baseUrl}/barbers/${bookingWithRelations.barber.slug}?booking=${bookingId}&payment=cancelled`,
      metadata: {
        bookingId: bookingId,
      },
      customer_email: bookingWithRelations.customer_email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 },
    );
  }
}
