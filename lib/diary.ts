import { DiaryEntry, Mood, MOODS, getMood } from './diary.shared';

export { MOODS, getMood };
export type { DiaryEntry, Mood };

const STORAGE_KEY = 'ruang-rasa:diary-entries';
const LIKED_STORAGE_KEY = 'ruang-rasa:liked-entry-ids';

function readLikedIds(): number[] {
  const rawIds = localStorage.getItem(LIKED_STORAGE_KEY);
  if (!rawIds) return [];

  const parsed: unknown = JSON.parse(rawIds);
  if (!Array.isArray(parsed) || !parsed.every((id) => Number.isSafeInteger(id) && id > 0)) {
    throw new Error('Data favorit tidak valid. Penyimpanan browser perlu diperiksa.');
  }

  return [...new Set(parsed as number[])];
}

function isDiaryEntry(entry: unknown): entry is DiaryEntry {
  if (typeof entry !== 'object' || entry === null) return false;

  const candidate = entry as Record<string, unknown>;
  const validMoods = new Set<string>(MOODS.map((mood) => mood.value));
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.mood === 'string' &&
    validMoods.has(candidate.mood)
  );
}

function readEntries(): DiaryEntry[] {
  const rawEntries = localStorage.getItem(STORAGE_KEY);
  if (!rawEntries) return [];

  const parsed: unknown = JSON.parse(rawEntries);
  if (!Array.isArray(parsed) || !parsed.every(isDiaryEntry)) {
    throw new Error('Data catatan tidak dapat dibaca. Penyimpanan browser perlu diperiksa.');
  }

  return parsed as DiaryEntry[];
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  return readEntries().sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function addDiaryEntry(title: string, body: string, mood: Mood) {
  const cleanTitle = title.trim();
  const cleanBody = body.trim();

  if (!cleanTitle || !cleanBody) {
    throw new Error('Judul dan cerita tidak boleh kosong.');
  }

  const entries = readEntries();
  const nextId = entries.reduce((largestId, entry) => Math.max(largestId, entry.id), 0) + 1;
  entries.push({
    id: nextId,
    title: cleanTitle,
    body: cleanBody,
    mood,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export async function getLikedEntryIds(): Promise<number[]> {
  return readLikedIds();
}

export async function setDiaryEntryLiked(id: number, liked: boolean) {
  const entries = readEntries();
  if (!entries.some((entry) => entry.id === id)) {
    throw new Error('Cerita ini tidak ditemukan dan belum dapat diperbarui.');
  }

  const ids = new Set(readLikedIds());
  if (liked) {
    ids.add(id);
  } else {
    ids.delete(id);
  }
  localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify([...ids]));
}
