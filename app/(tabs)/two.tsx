import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DiaryEntryCard from '@/components/DiaryEntryCard';
import LikeErrorNotice from '@/components/LikeErrorNotice';
import MoodFilterBar from '@/components/MoodFilterBar';
import { useDiarySearch } from '@/hooks/useDiarySearch';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { Mood } from '@/lib/diary';
import { useLikedEntriesStore } from '@/providers/LikedEntriesProvider';

export default function ArchiveScreen() {
  const { entries, loading, error, reload } = useDiaryEntries();
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const filteredEntries = useDiarySearch(entries, query, selectedMood);
  const { likeError } = useLikedEntriesStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.eyebrow}>JEJAK PERJALANANMU</Text>
          <Text style={styles.heading}>Semua cerita</Text>
          <Text style={styles.description}>
            {entries.length === 1 ? '1 catatan tersimpan' : `${entries.length} catatan tersimpan`}
            {' · '}setiap cerita punya tempatnya.
          </Text>

          <View style={styles.filterHeading}>
            <Text style={styles.filterTitle}>Saring berdasarkan suasana</Text>
            <Pressable
              onPress={() => {
                setQuery('');
                setSelectedMood(null);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Reset filter">
              <Text style={styles.resetFilter}>Reset Filter</Text>
            </Pressable>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari judul atau isi catatan"
              placeholderTextColor="#A19D93"
              style={styles.searchInput}
              accessibilityLabel="Cari catatan"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Hapus pencarian">
                <Text style={styles.clearSearch}>×</Text>
              </Pressable>
            )}
          </View>

          <MoodFilterBar selectedMood={selectedMood} onSelect={setSelectedMood} />

          <View style={styles.resultsHeading}>
            <Text style={styles.resultsTitle}>Catatanmu</Text>
            {!loading && !error && (
              <Text style={styles.resultCount}>{filteredEntries.length} cerita</Text>
            )}
          </View>

          <LikeErrorNotice message={likeError} />
          {loading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCopy}>Memuat cerita...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void reload()} style={styles.retryButton}>
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : filteredEntries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>{entries.length === 0 ? '🌿' : '🔎'}</Text>
              <Text style={styles.emptyTitle}>
                {entries.length === 0 ? 'Belum ada cerita di sini' : 'Cerita tidak ditemukan'}
              </Text>
              <Text style={styles.emptyCopy}>
                {entries.length === 0
                  ? 'Catatan yang kamu tulis akan muncul di halaman ini.'
                  : 'Coba kata kunci atau suasana hati yang lain.'}
              </Text>
            </View>
          ) : (
            filteredEntries.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  eyebrow: {
    color: '#64836D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heading: {
    color: '#292923',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 7,
  },
  description: {
    color: '#77746C',
    fontSize: 13,
    marginTop: 6,
  },
  searchBox: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
    paddingHorizontal: 13,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  searchIcon: {
    color: '#77746C',
    fontSize: 23,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#34332D',
    fontSize: 13,
    paddingVertical: 0,
  },
  clearSearch: {
    color: '#8B887F',
    fontSize: 22,
    paddingLeft: 8,
  },
  filterTitle: {
    color: '#77746C',
    fontSize: 12,
    fontWeight: '600',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  resetFilter: {
    color: '#56735D',
    fontSize: 11,
    fontWeight: '700',
  },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 13,
  },
  resultsTitle: {
    color: '#302F29',
    fontSize: 17,
    fontWeight: '700',
  },
  resultCount: {
    color: '#8A887F',
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  emptyEmoji: {
    fontSize: 27,
    marginBottom: 9,
  },
  emptyTitle: {
    color: '#393832',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyCopy: {
    color: '#858278',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  errorText: {
    color: '#A94338',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 5,
  },
  retryText: {
    color: '#56735D',
    fontSize: 13,
    fontWeight: '700',
  },
});
