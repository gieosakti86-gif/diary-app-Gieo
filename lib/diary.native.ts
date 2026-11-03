import type * as SQLite from 'expo-sqlite';

import { DiaryEntry, Mood, MOODS, getMood } from './diary.shared';

export { MOODS, getMood };
export type { DiaryEntry, Mood };

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = import('expo-sqlite').then(async (SQLite) => {
      const database = await SQLite.openDatabaseAsync('diary.db');
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS diary_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          mood TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);

      const columns = await database.getAllAsync<{ name: string }>(
        'PRAGMA table_info(diary_entries)'
      );
      if (!columns.some((column) => column.name === 'is_liked')) {
        await database.execAsync(
          'ALTER TABLE diary_entries ADD COLUMN is_liked INTEGER NOT NULL DEFAULT 0'
        );
      }

      await database.execAsync(
        'CREATE INDEX IF NOT EXISTS diary_entries_created_at ON diary_entries (created_at DESC)'
      );
      return database;
    });
  }

  try {
    return await databasePromise;
  } catch (error) {
    databasePromise = null;
    throw error;
  }
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  const database = await getDatabase();
  return database.getAllAsync<DiaryEntry>(
    `SELECT id, title, body, mood, created_at AS createdAt
     FROM diary_entries
     ORDER BY created_at DESC, id DESC`
  );
}

export async function addDiaryEntry(title: string, body: string, mood: Mood) {
  const cleanTitle = title.trim();
  const cleanBody = body.trim();

  if (!cleanTitle || !cleanBody) {
    throw new Error('Judul dan cerita tidak boleh kosong.');
  }

  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO diary_entries (title, body, mood, created_at) VALUES (?, ?, ?, ?)',
    cleanTitle,
    cleanBody,
    mood,
    new Date().toISOString()
  );
}

export async function getLikedEntryIds(): Promise<number[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ id: number }>(
    'SELECT id FROM diary_entries WHERE is_liked = 1 ORDER BY id DESC'
  );
  return rows.map((row) => row.id);
}

export async function setDiaryEntryLiked(id: number, liked: boolean) {
  const database = await getDatabase();
  const result = await database.runAsync(
    'UPDATE diary_entries SET is_liked = ? WHERE id = ?',
    liked ? 1 : 0,
    id
  );

  if (result.changes === 0) {
    throw new Error('Cerita ini tidak ditemukan dan belum dapat diperbarui.');
  }
}
