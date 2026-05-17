import { NextResponse } from "next/server";
import { verifyAdminSession, createAdminClient } from "@/lib/adminAuth";
import { blockedDateSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = blockedDateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors.map((item) => item.message).join(", ") }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (result.data.action === "block") {
    const { error } = await supabase.from("blocked_dates").insert({
      villa_id: Number(result.data.villa_id),
      block_date: result.data.block_date,
      reason: result.data.reason || null
    } as any);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("villa_id", Number(result.data.villa_id))
    .eq("block_date", result.data.block_date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
