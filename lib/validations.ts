import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  barberId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  locationType: z.enum(["in-shop", "home-visit"]),
  customerAddress: z.string().optional(),
  paymentMethod: z.enum(["on-site", "online"]),
});

export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  durationMinutes: z.number().min(5, "Duration must be at least 5 minutes"),
  price: z.number().min(0, "Price must be non-negative"),
  active: z.boolean().default(true),
});

export const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
});

export const barberProfileSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  address: z.string().optional(),
  city: z.string().optional(),
  travelEnabled: z.boolean().default(false),
  extraSectionEnabled: z.boolean().default(false),
  extraSectionTitle: z.string().optional(),
  extraSectionText: z.string().optional(),
});

export const notificationSubscriptionSchema = z.object({
  barberId: z.string().uuid(),
  subscriberEmail: z.string().email("Invalid email address"),
});
