import { createAdminClient } from "@/lib/adminAuth";
import { BookingsTable } from "@/components/admin/BookingsTable";

async function getData() {
  const supabase = createAdminClient();
  const [{ data: bookings }, { data: villas }] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase.from("villas").select("*").order("sort_order", { ascending: true })
  ]);
  return { bookings: bookings ?? [], villas: villas ?? [] };
}

export default async function AdminBookingPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <section className="surface-card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Manajemen Booking</h1>
        <p className="mt-3 text-slate-600">Filter, cari, dan konfirmasi booking langsung dari dashboard.</p>
      </section>
      <BookingsTable bookings={data.bookings} villas={data.villas} />
    </div>
  );
}
