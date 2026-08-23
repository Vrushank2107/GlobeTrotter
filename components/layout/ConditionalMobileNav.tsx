'use client';

import { useTripContext } from '@/context/TripContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MobileNav from './mobile-nav';

export default function ConditionalMobileNav() {
  const { user, loading } = useTripContext();
  const pathname = usePathname();
  const [shouldHide, setShouldHide] = useState(false);
  
  useEffect(() => {
    // Check if body has the hide-mobile-nav class (set by auth pages)
    const hasHideClass = document.body.classList.contains('hide-mobile-nav');
    const isAuthPage = pathname === '/login' || pathname === '/register';
    
    setShouldHide(hasHideClass || isAuthPage);
  }, [pathname]);
  
  // Only show mobile nav for authenticated users
  // Don't show nav while loading or if user is not authenticated
  // Also explicitly hide on login and register pages or when body has hide class
  if (loading || !user || shouldHide) {
    return null;
  }
  
  return <MobileNav />;
}
