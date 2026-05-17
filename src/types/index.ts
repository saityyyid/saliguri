export type Villa = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price_per_night: number;
  capacity: number;
  floors: number;
  rooms: number;
  beds_description: string | null;
  facilities: string[];
  images: string[];
  status: string;
  sort_order: number;
  created_at: string;
};

export type Booking = {
  id: string;
  booking_code: string;
  villa_id: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  guest_count: number;
  villa_price: number;
  addon_total: number;
  grand_total: number;
  dp_amount: number;
  status: string;
  payment_proof_url: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingAddon = {
  id: number;
  booking_id: string;
  addon_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
};

export type BlockedDate = {
  id: number;
  villa_id: number;
  block_date: string;
  reason: string | null;
};

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      villas: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          price_per_night: number;
          capacity: number;
          floors: number;
          rooms: number;
          beds_description: string | null;
          facilities: string[];
          images: string[];
          status: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Partial<Database["public"]["Tables"]["villas"]["Row"]>, "id" | "created_at"> & {
          name: string;
          slug: string;
          price_per_night: number;
          capacity: number;
        };
        Update: Partial<Database["public"]["Tables"]["villas"]["Row"]>;
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string;
          villa_id: number;
          guest_name: string;
          guest_phone: string;
          guest_email: string | null;
          check_in: string;
          check_out: string;
          nights: number;
          guest_count: number;
          villa_price: number;
          addon_total: number;
          grand_total: number;
          dp_amount: number;
          status: string;
          payment_proof_url: string | null;
          payment_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Partial<Database["public"]["Tables"]["bookings"]["Row"]>, "id" | "created_at" | "updated_at"> & {
          booking_code: string;
          villa_id: number;
          guest_name: string;
          guest_phone: string;
          check_in: string;
          check_out: string;
          nights: number;
          guest_count: number;
          villa_price: number;
          grand_total: number;
          dp_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
      };
      booking_addons: {
        Row: {
          id: number;
          booking_id: string;
          addon_name: string;
          quantity: number;
          price_per_unit: number;
          total_price: number;
        };
        Insert: Omit<Partial<Database["public"]["Tables"]["booking_addons"]["Row"]>, "id"> & {
          booking_id: string;
          addon_name: string;
          quantity: number;
          price_per_unit: number;
          total_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["booking_addons"]["Row"]>;
      };
      blocked_dates: {
        Row: {
          id: number;
          villa_id: number;
          block_date: string;
          reason: string | null;
        };
        Insert: Omit<Partial<Database["public"]["Tables"]["blocked_dates"]["Row"]>, "id"> & {
          villa_id: number;
          block_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["blocked_dates"]["Row"]>;
      };
    };
  };
}
