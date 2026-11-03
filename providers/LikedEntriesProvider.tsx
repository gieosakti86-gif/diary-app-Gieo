import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { getLikedEntryIds, setDiaryEntryLiked } from '@/lib/diary';

type LikedEntriesContextValue = {
  likedIds: Set<number>;
  loadingLikes: boolean;
  pendingLikeIds: Set<number>;
  likeError: string | null;
  toggleLike: (id: number) => Promise<void>;
};

const LikedEntriesContext = createContext<LikedEntriesContextValue | null>(null);

export function LikedEntriesProvider({ children }: { children: ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(new Set());
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likedIdsRef = useRef(likedIds);
  const pendingLikeIdsRef = useRef(pendingLikeIds);

  useEffect(() => {
    let active = true;

    void getLikedEntryIds()
      .then((ids) => {
        if (!active) return;
        const nextIds = new Set(ids);
        likedIdsRef.current = nextIds;
        setLikedIds(nextIds);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLikeError(
          error instanceof Error ? error.message : 'Status favorit belum dapat dimuat.'
        );
      })
      .finally(() => {
        if (active) setLoadingLikes(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleLike = useCallback(async (id: number) => {
    if (pendingLikeIdsRef.current.has(id)) return;

    const wasLiked = likedIdsRef.current.has(id);
    const nextLiked = !wasLiked;
    const nextPending = new Set(pendingLikeIdsRef.current).add(id);
    pendingLikeIdsRef.current = nextPending;
    setPendingLikeIds(nextPending);

    const optimisticIds = new Set(likedIdsRef.current);
    if (nextLiked) optimisticIds.add(id);
    else optimisticIds.delete(id);
    likedIdsRef.current = optimisticIds;
    setLikedIds(optimisticIds);
    setLikeError(null);

    try {
      await setDiaryEntryLiked(id, nextLiked);
    } catch (error) {
      const restoredIds = new Set(likedIdsRef.current);
      if (wasLiked) restoredIds.add(id);
      else restoredIds.delete(id);
      likedIdsRef.current = restoredIds;
      setLikedIds(restoredIds);
      setLikeError(error instanceof Error ? error.message : 'Status favorit belum dapat disimpan.');
    } finally {
      const remainingPending = new Set(pendingLikeIdsRef.current);
      remainingPending.delete(id);
      pendingLikeIdsRef.current = remainingPending;
      setPendingLikeIds(remainingPending);
    }
  }, []);

  return (
    <LikedEntriesContext.Provider
      value={{ likedIds, loadingLikes, pendingLikeIds, likeError, toggleLike }}>
      {children}
    </LikedEntriesContext.Provider>
  );
}

export function useLikedEntriesStore() {
  const context = useContext(LikedEntriesContext);
  if (!context) {
    throw new Error('useLikedEntriesStore harus digunakan di dalam LikedEntriesProvider.');
  }
  return context;
}
