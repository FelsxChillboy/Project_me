import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portal Berita HIMA Ilmu Hukum",
    template: "%s | HIMA Ilmu Hukum",
  },
  description:
    "Portal resmi berita, pengumuman, kajian akademik, opini hukum, dan dokumentasi kegiatan Himpunan Mahasiswa Ilmu Hukum.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Portal Berita HIMA Ilmu Hukum",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${newsreader.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#F7F4EE] font-sans text-[#14263D] antialiased">
        {children}
      </body>
    </html>
  );
}
