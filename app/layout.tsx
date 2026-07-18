import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/app/context/cart-context";
import SessionProvider from "@/components/session-provider";

import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hijab Paradise - Online Shop Pakaian Muslim",
  description:
    "Toko online pakaian muslim berkualitas dengan desain modern dan islami. Temukan koleksi hijab, gamis, tunik, pashmina, dan abaya terbaru.",
  generator: "v0.app",
  keywords: [
    "hijab",
    "pakaian muslim",
    "gamis",
    "tunik",
    "pashmina",
    "abaya",
    "jilbab",
    "busana muslim",
    "online shop hijab",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
