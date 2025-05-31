import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiftingStar - Stellar Hediye DApp",
  description:
    "Stellar blockchain üzerinde özel günlerde otomatik hediye gönderme uygulaması",
  keywords: ["stellar", "soroban", "blockchain", "hediye", "dapp", "crypto"],
  authors: [{ name: "GiftingStar Team" }],
  openGraph: {
    title: "GiftingStar - Stellar Hediye DApp",
    description: "Özel günlerde sevdiklerinize otomatik hediye gönderin",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftingStar - Stellar Hediye DApp",
    description: "Özel günlerde sevdiklerinize otomatik hediye gönderin",
    images: ["/og-image.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {children}
        </div>
      </body>
    </html>
  );
}
