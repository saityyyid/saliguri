import { formatRupiah } from "@/lib/utils";
import { createAdminClient } from "@/lib/adminAuth";
import Link from "next/link";

async function getStats() {
  const supabase = createAdminClient();
  const [totalRes, pendingRes, confirmedRes, recentRes] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("bookings").select("*, villas(name)").order("created_at", { ascending: false }).limit(5)
  ]);

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("grand_total")
    .gte("created_at", monthStart)
    .neq("status", "cancelled");

  const monthlyRevenue = (revenueData as Array<{ grand_total?: number }> | undefined)?.reduce((sum, item) => sum + (item.grand_total ?? 0), 0) ?? 0;

  return {
    total: (totalRes as any)?.count ?? 0,
    pending: (pendingRes as any)?.count ?? 0,
    confirmed: (confirmedRes as any)?.count ?? 0,
    monthlyRevenue,
    recent: (recentRes as any)?.data ?? []
  };
}

export default async function AdminHomePage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Booking</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pending</p>
          <p className="mt-4 text-3xl font-semibold text-warning">{stats.pending}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Confirmed</p>
          <p className="mt-4 text-3xl font-semibold text-success">{stats.confirmed}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pendapatan Bulanan</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatRupiah(stats.monthlyRevenue)}</p>
        </div>
      </div>

      <section className="surface-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking Terbaru</p>
            <h2 className="text-2xl font-semibold text-slate-900">5 booking terakhir</h2>
          </div>
          <Link href="/admin/booking" className="rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-[#eef1e3]">Lihat Semua</Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Villa</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stats.recent.map((booking: any) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 font-semibold text-slate-900">{booking.booking_code}</td>
                  <td className="px-4 py-4">{booking.guest_name}</td>
                  <td className="px-4 py-4">{booking.villas?.name ?? "-"}</td>
                  <td className="px-4 py-4">{new Date(booking.check_in).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-4">{formatRupiah(booking.grand_total)}</td>
                  <td className="px-4 py-4 capitalize">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
