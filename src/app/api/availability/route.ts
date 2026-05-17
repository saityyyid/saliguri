import { NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabaseAnon = getSupabaseAnon();
  const url = new URL(request.url);
  const villaId = Number(url.searchParams.get("villa_id"));
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!villaId || !start || !end) {
    return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });
  }

  const { data: booked, error: bookingError } = await supabaseAnon
    .from("bookings")
    .select("id")
    .eq("villa_id", villaId)
    .neq("status", "cancelled")
    .or(`and(check_in.lt.${end},check_out.gt.${start})`);

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 });
  }

  const { data: blocked, error: blockedError } = await supabaseAnon
    .from("blocked_dates")
    .select("id")
    .eq("villa_id", villaId)
    .gte("block_date", start)
    .lte("block_date", end);

  if (blockedError) {
    return NextResponse.json({ error: blockedError.message }, { status: 500 });
  }

  return NextResponse.json({ available: (booked?.length ?? 0) === 0 && (blocked?.length ?? 0) === 0 });
}
