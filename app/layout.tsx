import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KonamiEffects } from "@/components/KonamiEffects";
import { siteConfig } from "@/site.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsTerminal = JetBrains_Mono({
  variable: "--font-terminal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.canonicalUrl,
    siteName: siteConfig.siteTitle,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        alt: siteConfig.siteTitle,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={siteConfig.defaultTheme}
      data-appearance={
        siteConfig.defaultTheme === "macos"
          ? siteConfig.defaultMacAppearance
          : undefined
      }
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsTerminal.variable}`}
      >
        <ThemeProvider
          defaultTheme={siteConfig.defaultTheme}
          defaultMacAppearance={siteConfig.defaultMacAppearance}
        >
          <KonamiEffects />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
