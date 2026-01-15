import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatTimeSlot } from "@/lib/utils/booking";

type BookingWithRelations = {
  customer_email: string;
  customer_name: string;
  starts_at: string;
  ends_at: string;
  services: { title: string };
  barbers: { shop_name: string };
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    const supabase = await createClient();

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

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: typedBooking.customer_email,
      subject: `Booking Cancelled - ${typedBooking.barbers.shop_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi ${typedBooking.customer_name},</p>
              <p>Your booking at <strong>${typedBooking.barbers.shop_name}</strong> has been cancelled.</p>
              <p><strong>Service:</strong> ${typedBooking.services.title}</p>
              <p><strong>Date:</strong> ${formatDate(typedBooking.starts_at)}</p>
              <p><strong>Time:</strong> ${formatTimeSlot(typedBooking.starts_at, typedBooking.ends_at)}</p>
              <p>We hope to see you again soon!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
