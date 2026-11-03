import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: "Hand-poured scented candles and candle gifts, made in Bengaluru and shipped across India.",
  openGraph: {
    title: SITE_NAME,
    description: "Hand-poured scented candles and candle gifts, made in Bengaluru and shipped across India.",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [DEFAULT_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}