import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatTimeSlot } from "@/lib/utils/booking";

type BookingWithRelations = {
  customer_email: string;
  customer_name: string;
  starts_at: string;
  ends_at: string;
  cancellation_token: string;
  location_type: "in-shop" | "home-visit";
  payment_method: "on-site" | "online";
  services: { title: string; price: number };
  barbers: { shop_name: string; address: string | null; city: string | null };
};

const resend = new Resend(process.env.RESEND_API_KEY);

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
        services(title, price),
        barbers(shop_name, address, city)
      `
      )
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const typedBooking = booking as unknown as BookingWithRelations;

    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/cancel?token=${typedBooking.cancellation_token}`;

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: typedBooking.customer_email,
      subject: `Booking Confirmation - ${typedBooking.barbers.shop_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${typedBooking.customer_name},</p>
              <p>Your appointment has been confirmed at <strong>${typedBooking.barbers.shop_name}</strong>.</p>
              
              <div class="details">
                <h2>Booking Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span>${typedBooking.services.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span>${formatDate(typedBooking.starts_at)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span>${formatTimeSlot(typedBooking.starts_at, typedBooking.ends_at)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${typedBooking.location_type === "in-shop" ? `${typedBooking.barbers.address}, ${typedBooking.barbers.city}` : "Home Visit"}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Price:</span>
                  <span>$${typedBooking.services.price}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment:</span>
                  <span>${typedBooking.payment_method === "on-site" ? "Pay at shop" : "Online payment"}</span>
                </div>
              </div>

              <p><strong>Important:</strong> You can cancel this booking up to 24 hours before your appointment.</p>
              
              <div style="text-align: center;">
                <a href="${cancelUrl}" class="button">Cancel Booking</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for choosing ${typedBooking.barbers.shop_name}!</p>
              <p>If you have any questions, please reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
