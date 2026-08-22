import type { Metadata } from 'next';
import './globals.css';
import { TripProvider } from '@/context/TripContext';

export const metadata: Metadata = {
  title: 'GlobeTrotter | Plan smarter. Travel better.',
  description: 'Personalized multi-city travel planning platform built for seamless trip discovery, itinerary building, and budget tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans antialiased">
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
