'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isSupported, getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '@/lib/firebase';

export default function FirebaseAnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          const analytics = getAnalytics(app);
          const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
          
          logEvent(analytics, 'page_view', {
            page_path: url,
          });
        }
      });
    }
  }, [pathname, searchParams]);

  return null;
}
