import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiftingStar - Stellar Hediye DApp",
  description:
    "Özel günlerde sevdiklerinize otomatik hediye gönderin. Stellar blockchain ile güvenli ve zamanında teslimat.",
  keywords: "stellar, blockchain, gift, hediye, crypto, soroban, dapp",
  authors: [{ name: "GiftingStar Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ec4899",
  openGraph: {
    title: "GiftingStar - Stellar Hediye DApp",
    description: "Özel günlerde sevdiklerinize otomatik hediye gönderin.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftingStar - Stellar Hediye DApp",
    description: "Özel günlerde sevdiklerinize otomatik hediye gönderin.",
  },
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
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
