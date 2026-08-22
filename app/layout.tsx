import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobeTrotter - Plan smarter. Travel better.",
  description: "Personalized multi-city travel planning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
