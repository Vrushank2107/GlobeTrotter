'use client';

import { useTripContext } from '@/context/TripContext';
import MobileNav from './mobile-nav';

export default function ConditionalMobileNav() {
  const { user, loading } = useTripContext();
  
  // Only show mobile nav for authenticated users
  // Don't show nav while loading or if user is not authenticated
  if (loading || !user) {
    return null;
  }
  
  return <MobileNav />;
}
