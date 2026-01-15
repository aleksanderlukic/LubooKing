import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notificationSubscriptionSchema } from "@/lib/validations";
import { Database } from "@/lib/supabase/database.types";

type NotificationSubscription =
  Database["public"]["Tables"]["notification_subscriptions"]["Row"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = notificationSubscriptionSchema.parse(body);

    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("notification_subscriptions")
      .select("*")
      .eq("barber_id", validated.barberId)
      .eq("subscriber_email", validated.subscriberEmail)
      .single();

    if (existing) {
      const typedExisting = existing as NotificationSubscription;
      // Reactivate if inactive
      if (!typedExisting.active) {
        await supabase
          .from("notification_subscriptions")
          // @ts-expect-error Supabase type inference issue
          .update({ active: true })
          .eq("id", typedExisting.id);

        return NextResponse.json({ message: "Subscription reactivated" });
      }

      return NextResponse.json({ message: "Already subscribed" });
    }

    // Create new subscription
    const { error } = await supabase
      .from("notification_subscriptions")
      // @ts-expect-error Supabase type inference issue
      .insert({
        barber_id: validated.barberId,
        subscriber_email: validated.subscriberEmail,
        active: true,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
