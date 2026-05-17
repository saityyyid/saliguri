import { createAdminClient } from "@/lib/adminAuth";
import { VillaSettings } from "@/components/admin/VillaSettings";

async function getVillas() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("villas").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export default async function AdminVillaPage() {
  const villas = await getVillas();

  return (
    <div className="space-y-6">
      <section className="surface-card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Pengaturan Villa</h1>
        <p className="mt-3 text-slate-600">Edit harga, status, dan urutan tampilan untuk setiap villa.</p>
      </section>
      <VillaSettings villas={villas} />
    </div>
  );
}
