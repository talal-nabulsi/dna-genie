import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DNA Genie — Decode Your DNA",
  description:
    "Upload your 23andMe or AncestryDNA raw data and discover 40+ genetic traits. 100% client-side — your DNA never touches a server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <AnalyticsProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
