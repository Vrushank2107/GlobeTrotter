'use client';

import { useTripContext } from '@/context/TripContext';
import { usePathname } from 'next/navigation';
import MobileNav from './mobile-nav';

export default function ConditionalMobileNav() {
  const { user, loading } = useTripContext();
  const pathname = usePathname();
  
  // Only show mobile nav for authenticated users
  // Don't show nav while loading or if user is not authenticated
  // Also explicitly hide on login and register pages
  if (loading || !user || pathname === '/login' || pathname === '/register') {
    return null;
  }
  
  return <MobileNav />;
}
