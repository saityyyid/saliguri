import { createAdminClient } from "@/lib/adminAuth";
import { CalendarView } from "@/components/admin/CalendarView";

async function getData() {
  const supabase = createAdminClient();
  const [{ data: villas }, { data: bookings }, { data: blockedDates }] = await Promise.all([
    supabase.from("villas").select("*").order("sort_order", { ascending: true }),
    supabase.from("bookings").select("*").neq("status", "cancelled"),
    supabase.from("blocked_dates").select("*")
  ]);

  return {
    villas: villas ?? [],
    bookings: bookings ?? [],
    blockedDates: blockedDates ?? []
  };
}

export default async function AdminCalendarPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <section className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Kalender Reservasi</h1>
        <p className="mt-3 text-slate-700">Kelola tanggal terblokir dan lihat status booking untuk setiap villa.</p>
      </section>
      <CalendarView villas={data.villas} bookings={data.bookings} blockedDates={data.blockedDates} />
    </div>
  );
}
