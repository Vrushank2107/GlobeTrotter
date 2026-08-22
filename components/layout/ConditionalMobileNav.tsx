'use client';

import { useTripContext } from '@/context/TripContext';
import MobileNav from './mobile-nav';

export default function ConditionalMobileNav() {
  const { user } = useTripContext();
  
  // Only show mobile nav for authenticated users
  const isGuest = !user || user.id === 'usr_guest' || user.email === 'user@globetrotter.com';
  
  if (isGuest) {
    return null;
  }
  
  return <MobileNav />;
}
