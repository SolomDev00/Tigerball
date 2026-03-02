import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LenisProvider } from "@/providers/LenisProvider";
import { AppLayout } from "@/components/layout/AppLayout";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tigerball | تايجر بول",
  description: "Tigerball Vollayball Tracker",
  icons: {
    icon: "/tiger.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            cairo.variable,
          )}
        >
          <LenisProvider>
            <AppLayout>{children}</AppLayout>
          </LenisProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
