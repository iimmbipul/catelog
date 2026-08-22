import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://whiteandwick.example"),
  title: {
    default: "White & Wick — Light something beautiful.",
    template: "%s • White & Wick",
  },
  description:
    "White & Wick creates thoughtfully crafted candles designed to turn ordinary moments into warm, beautiful rituals.",
  openGraph: {
    title: "White & Wick",
    description:
      "Hand-poured scented candles and gifting for the everyday and the extraordinary.",
    type: "website",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
