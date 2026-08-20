import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteDescription, siteProfile } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: {
    default: `${siteProfile.publicName} — ${siteProfile.professionalTitle}`,
    template: `%s — ${siteProfile.publicName}`,
  },
  description: siteDescription,
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5f0e6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${playfairDisplay.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

