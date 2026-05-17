export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(value: number | string) {
  const numberValue = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(numberValue);
}

export function formatDate(date: string | Date) {
  const dt = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(dt);
}

export function getWhatsAppLink(message: string) {
  const base = "https://wa.me/6281368008800";
  const text = encodeURIComponent(message);
  return `${base}?text=${text}`;
}
