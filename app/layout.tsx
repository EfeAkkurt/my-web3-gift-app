import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiftingStar - Stellar Gift DApp",
  description:
    "Send automatic gifts on special occasions. Secure and timely delivery with Stellar blockchain.",
  keywords: "stellar, blockchain, gift, crypto, soroban, dapp",
  authors: [{ name: "GiftingStar Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ec4899",
  openGraph: {
    title: "GiftingStar - Stellar Gift DApp",
    description: "Send automatic gifts on special occasions.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftingStar - Stellar Gift DApp",
    description: "Send automatic gifts on special occasions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />{" "}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ec4899" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
