import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/SupabaseProvider";

export const metadata: Metadata = {
  title: "Saliguri Harau Cottage",
  description: "Pesan villa dan aula di Lembah Harau dengan sistem reservasi online yang mudah.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://saliguri-harau.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
