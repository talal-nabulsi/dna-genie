import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Hedvig_Letters_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TRAITS } from "@/lib/traits/panel";

const display = Hedvig_Letters_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap", adjustFontFallback: false });
const text = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-text", display: "swap", adjustFontFallback: false });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", adjustFontFallback: false });

const description = `Read ${TRAITS.length} well-studied DNA markers from a 23andMe or AncestryDNA file, beside your own blood test. Both files are read on your device.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://dnagenie.app"),
  title: { default: "DNA Genie", template: "%s | DNA Genie" },
  description,
  openGraph: { type: "website", url: "https://dnagenie.app", siteName: "DNA Genie", title: "DNA Genie", description },
  twitter: { card: "summary_large_image", title: "DNA Genie", description },
};

export const viewport: Viewport = { themeColor: "#fbf3f5", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
