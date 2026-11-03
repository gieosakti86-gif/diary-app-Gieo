import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { DiaryEntry, getDiaryEntries } from '@/lib/diary';

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setEntries(await getDiaryEntries());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Catatan belum dapat dimuat. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadEntries();
    }, [loadEntries])
  );

  return { entries, loading, error, reload: loadEntries };
}
