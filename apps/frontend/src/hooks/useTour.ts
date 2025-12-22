import { useRef, useCallback } from 'react';
import { createTour } from '@/lib/tour';
import { useAppStore } from '@/stores/useAppStore';
import Shepherd from 'shepherd.js';

export function useTour() {
  const tourRef = useRef<InstanceType<typeof Shepherd.Tour> | null>(null);
  const setPage = useAppStore((s) => s.setPage);

  const startTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.complete();
      tourRef.current = null;
    }

    tourRef.current = createTour({ setPage });
    tourRef.current.start();
  }, [setPage]);

  return { startTour };
}
