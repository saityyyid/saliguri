import { z } from "zod";

export const bookingAddonSchema = z.object({
  addon_name: z.string(),
  quantity: z.number().min(1),
  price_per_unit: z.number().min(0),
  total_price: z.number().min(0)
});

export const bookingCreateSchema = z.object({
  villa_id: z.string().nonempty({ message: "Pilih villa terlebih dahulu." }),
  guest_name: z.string().min(2, "Nama harus diisi."),
  guest_phone: z.string().min(10, "Nomor WhatsApp harus valid."),
  guest_email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  check_in: z.string().min(1, "Tanggal check-in wajib diisi."),
  check_out: z.string().min(1, "Tanggal check-out wajib diisi."),
  guest_count: z.number().min(1, "Jumlah tamu minimal 1."),
  extrabed_count: z.number().min(0),
  nights: z.number().min(1),
  villa_price: z.number().min(0),
  addon_total: z.number().min(0),
  grand_total: z.number().min(0),
  dp_amount: z.number().min(0),
  payment_proof_url: z.string().optional().or(z.null()),
  notes: z.string().max(500).optional().or(z.literal("")),
  addons: z.array(bookingAddonSchema).optional()
});

export const bookingLookupSchema = z.object({
  booking_code: z.string().min(3, "Kode booking harus diisi."),
  guest_phone: z.string().min(10, "Nomor WhatsApp harus valid.")
});

export const statusUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]),
  payment_status: z.enum(["unpaid", "dp_paid", "paid"]).optional()
});

export const blockedDateSchema = z.object({
  villa_id: z.string().nonempty("Pilih villa."),
  block_date: z.string().min(1, "Tanggal wajib diisi."),
  reason: z.string().optional().or(z.literal("")),
  action: z.enum(["block", "unblock"])
});

export const adminLoginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter.")
});
