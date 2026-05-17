import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Ukuran file maksimal 2MB." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Konfigurasi Supabase belum lengkap." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error } = await supabase.storage.from("payment-proofs").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/payment-proofs/${fileName}`;
  return NextResponse.json({ url: publicUrl });
}
