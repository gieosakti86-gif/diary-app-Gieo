import { useMemo } from 'react';

import { DiaryEntry, Mood } from '@/lib/diary';

export function useDiarySearch(
  entries: DiaryEntry[],
  query: string,
  selectedMood: Mood | null
) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');

    return entries.filter((entry) => {
      const matchesMood = selectedMood === null || entry.mood === selectedMood;
      const searchableText = `${entry.title} ${entry.body}`.toLocaleLowerCase('id-ID');
      return matchesMood && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [entries, query, selectedMood]);
}
