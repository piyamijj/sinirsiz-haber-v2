import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sınırsız Haber",
  description: "Mobil Uyumlu Haber Sitesi",
  icons: {
    icon: "/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        <nav className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Sınırsız Haber" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-blue-700">Sınırsız Haber</span>
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
