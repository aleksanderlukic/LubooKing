export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      barbers: {
        Row: {
          id: string;
          user_id: string | null;
          slug: string;
          shop_name: string;
          address: string | null;
          postal_code: string | null;
          city: string | null;
          phone: string | null;
          email: string | null;
          bio: string | null;
          travel_enabled: boolean;
          logo_url: string | null;
          default_theme: string;
          extra_section_enabled: boolean;
          extra_section_title: string | null;
          extra_section_text: string | null;
          extra_section_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          slug: string;
          shop_name: string;
          address?: string | null;
          postal_code?: string | null;
          city?: string | null;
          phone?: string | null;
          email?: string | null;
          bio?: string | null;
          travel_enabled?: boolean;
          logo_url?: string | null;
          default_theme?: string;
          extra_section_enabled?: boolean;
          extra_section_title?: string | null;
          extra_section_text?: string | null;
          extra_section_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          slug?: string;
          shop_name?: string;
          address?: string | null;
          postal_code?: string | null;
          city?: string | null;
          phone?: string | null;
          email?: string | null;
          bio?: string | null;
          travel_enabled?: boolean;
          logo_url?: string | null;
          default_theme?: string;
          extra_section_enabled?: boolean;
          extra_section_title?: string | null;
          extra_section_text?: string | null;
          extra_section_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          barber_id: string;
          title: string;
          duration_minutes: number;
          price: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          title: string;
          duration_minutes: number;
          price: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          title?: string;
          duration_minutes?: number;
          price?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          barber_id: string;
          date: string;
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          date: string;
          start_time: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          barber_id: string;
          service_id: string;
          starts_at: string;
          ends_at: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          location_type: "in-shop" | "home-visit";
          customer_address: string | null;
          payment_method: "on-site" | "online";
          payment_status: "pending" | "completed" | "failed" | "refunded";
          status: "booked" | "completed" | "no-show" | "cancelled";
          cancelled_at: string | null;
          cancellation_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          service_id: string;
          starts_at: string;
          ends_at: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          location_type: "in-shop" | "home-visit";
          customer_address?: string | null;
          payment_method: "on-site" | "online";
          payment_status?: "pending" | "completed" | "failed" | "refunded";
          status?: "booked" | "completed" | "no-show" | "cancelled";
          cancelled_at?: string | null;
          cancellation_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          service_id?: string;
          starts_at?: string;
          ends_at?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          location_type?: "in-shop" | "home-visit";
          customer_address?: string | null;
          payment_method?: "on-site" | "online";
          payment_status?: "pending" | "completed" | "failed" | "refunded";
          status?: "booked" | "completed" | "no-show" | "cancelled";
          cancelled_at?: string | null;
          cancellation_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          provider: string;
          provider_payment_id: string | null;
          amount: number;
          currency: string;
          status: "pending" | "completed" | "failed" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          provider: string;
          provider_payment_id?: string | null;
          amount: number;
          currency?: string;
          status?: "pending" | "completed" | "failed" | "refunded";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          provider?: string;
          provider_payment_id?: string | null;
          amount?: number;
          currency?: string;
          status?: "pending" | "completed" | "failed" | "refunded";
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_subscriptions: {
        Row: {
          id: string;
          barber_id: string;
          subscriber_email: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          subscriber_email: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          subscriber_email?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          barber_id: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
  };
}
