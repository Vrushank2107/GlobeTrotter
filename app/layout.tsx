import type { Metadata } from 'next';
import './globals.css';
import { TripProvider } from '@/context/TripContext';
import { ConfirmDialogProvider } from '@/context/ConfirmDialogContext';
import ConditionalMobileNav from '@/components/layout/ConditionalMobileNav';

export const metadata: Metadata = {
  title: 'GlobeTrotter | Plan smarter. Travel better.',
  description: 'Personalized multi-city travel planning platform built for seamless trip discovery, itinerary building, and budget tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans antialiased">
        <ConfirmDialogProvider>
          <TripProvider>
            {children}
            <ConditionalMobileNav />
          </TripProvider>
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}
