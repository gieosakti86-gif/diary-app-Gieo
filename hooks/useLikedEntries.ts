import { useMemo } from 'react';

import { DiaryEntry } from '@/lib/diary';

export function useLikedEntries(entries: DiaryEntry[], likedIds: Set<number>) {
  return useMemo(
    () => entries.filter((entry) => likedIds.has(entry.id)),
    [entries, likedIds]
  );
}
