import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Public-site typefaces (also used by the admin preview of a school profile).
// Headings: Libre Caslon, a classic book face. Body: Hanken Grotesk, a quiet sans.
const caslon = Libre_Caslon_Display({ subsets: ["latin"], weight: "400", variable: "--font-caslon", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });

export const metadata: Metadata = {
  title: "SchoolSpot Zimbabwe",
  description: "Find and compare schools across Zimbabwe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caslon.variable} ${hanken.variable} antialiased`}
      >
        {/* global toast provider */}
        <Toaster />
        {children}
      </body>
    </html>
  );
}
