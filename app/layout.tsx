import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = "https://dnagenie.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DNA Genie — Decode your genome in the browser",
    template: "%s · DNA Genie",
  },
  description:
    "Upload a 23andMe or AncestryDNA export and discover 40 research-backed genetic traits. Parsing happens entirely in your browser — your raw DNA never touches a server.",
  keywords: ["DNA", "23andMe", "AncestryDNA", "genetics", "SNP", "traits", "privacy", "genome"],
  authors: [{ name: "Talal Nabulsi", url: "https://github.com/talal-nabulsi" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DNA Genie",
    title: "DNA Genie — Decode your genome in the browser",
    description:
      "40 research-backed traits from your 23andMe or AncestryDNA file. 100% client-side parsing. Explore an interactive 3D genome.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DNA Genie — Decode your genome in the browser",
    description:
      "40 research-backed traits from your 23andMe or AncestryDNA file. 100% client-side parsing.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <DemoProvider>
            <AnalyticsProvider />
            {children}
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
