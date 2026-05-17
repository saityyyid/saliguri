import { NextResponse } from "next/server";
import { verifyAdminSession, createAdminClient } from "@/lib/adminAuth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates = {
    price_per_night: body.price_per_night,
    status: body.status,
    sort_order: body.sort_order
  };

  const supabase = createAdminClient();
  const { data, error } = await (supabase as any)
    .from("villas")
    .update(updates)
    .eq("id", Number(params.id))
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Gagal memperbarui villa." }, { status: 500 });
  }

  return NextResponse.json({ villa: data });
}
