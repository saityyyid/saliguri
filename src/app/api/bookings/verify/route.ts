import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const phone = url.searchParams.get("phone");

  if (!code || !phone) {
    return NextResponse.json({ error: "Kode booking dan nomor telepon harus diisi." }, { status: 400 });
  }

  const { data, error } = await supabaseAnon
    .from("bookings")
    .select("*, villas(name, slug)")
    .eq("booking_code", code)
    .eq("guest_phone", phone)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ booking: data });
}
