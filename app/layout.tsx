import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StayEase — Smart PG Management",
  description: "Find and manage your perfect PG. Rooms, tenants, complaints, payments — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} bg-[#050508] text-white antialiased selection:bg-purple-500/30`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
