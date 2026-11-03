import { Link } from 'expo-router';
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

const today = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export default function JournalScreen() {
  const { entries, loading, error, reload } = useDiaryEntries();
  const [query, setQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const filteredEntries = useDiarySearch(entries, query, selectedMood);
  const { likedIds, likeError } = useLikedEntriesStore();
  const monthEntries = entries.filter((entry) => {
    const date = new Date(entry.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.topline}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>✦</Text>
              </View>
              <Text style={styles.brandName}>Ruang Rasa</Text>
            </View>
            <Text style={styles.dateLabel}>{today}</Text>
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>RUANG KECIL UNTUK DIRIMU</Text>
            <Text style={styles.heading}>Bagaimana{'\n'}perasaanmu hari ini?</Text>
            <Text style={styles.description}>
              Tak perlu sempurna. Ceritakan saja apa yang ada di pikiranmu.
            </Text>
          </View>

          <Link href="/modal" asChild>
            <Pressable style={styles.writeButton}>
              <View style={styles.writeIcon}>
                <Text style={styles.writeIconText}>＋</Text>
              </View>
              <View style={styles.writeCopy}>
                <Text style={styles.writeTitle}>Mulai menulis</Text>
                <Text style={styles.writeSubtitle}>Satu cerita kecil berarti</Text>
              </View>
              <Text style={styles.writeArrow}>›</Text>
            </Pressable>
          </Link>

          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>CERITAMU BULAN INI</Text>
              <Text style={styles.summaryNumber}>{monthEntries.length}</Text>
              <Text style={styles.summaryCopy}>catatan tersimpan</Text>
            </View>
            <View style={styles.summaryArt}>
              <Text style={styles.summaryEmoji}>🌱</Text>
              <Text style={styles.summaryArtText}>terus{'\n'}bertumbuh</Text>
            </View>
          </View>

          <View style={styles.filterHeading}>
            <View>
              <Text style={styles.filterTitle}>Jelajahi ceritamu</Text>
              <Text style={styles.filterSubtitle}>Cari atau pilih suasana hati</Text>
            </View>
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
              placeholder="Cari judul atau isi cerita"
              placeholderTextColor="#A19D93"
              style={styles.searchInput}
              accessibilityLabel="Cari cerita di beranda"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => setQuery('')}
                hitSlop={8}
                accessibilityLabel="Hapus pencarian">
                <Text style={styles.clearSearch}>×</Text>
              </Pressable>
            )}
          </View>
          <MoodFilterBar selectedMood={selectedMood} onSelect={setSelectedMood} />

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Potongan ceritamu</Text>
              <Text style={styles.sectionSubtitle}>
                {selectedMood
                  ? `Suasana ${selectedMood} · ${filteredEntries.length} cerita`
                  : `${filteredEntries.length} cerita · ${likedIds.size} favorit`}
              </Text>
            </View>
            {entries.length > 0 && (
              <Link href="/two" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.seeAll}>Lihat semua</Text>
                </Pressable>
              </Link>
            )}
          </View>

          <LikeErrorNotice message={likeError} />
          {loading ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>Menyiapkan ruang ceritamu...</Text>
            </View>
          ) : error ? (
            <View style={styles.messageCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void reload()} style={styles.retryButton}>
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : entries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyTitle}>Halaman pertamamu menunggu</Text>
              <Text style={styles.emptyCopy}>
                Tulis apa pun yang kamu rasakan. Catatanmu tersimpan di perangkat ini.
              </Text>
            </View>
          ) : filteredEntries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTitle}>Belum ada cerita yang cocok</Text>
              <Text style={styles.emptyCopy}>Coba kata kunci atau suasana hati yang lain.</Text>
              <Pressable
                onPress={() => {
                  setQuery('');
                  setSelectedMood(null);
                }}
                style={styles.emptyReset}>
                <Text style={styles.emptyResetText}>Reset Filter</Text>
              </Pressable>
            </View>
          ) : (
            filteredEntries
              .slice(0, 3)
              .map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)
          )}

          <Text style={styles.privacyNote}>🔒 Catatanmu tersimpan pribadi di perangkat ini.</Text>
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
  },
  topline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#56735D',
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  brandName: {
    color: '#34352E',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dateLabel: {
    color: '#8A887F',
    fontSize: 11,
  },
  intro: {
    marginTop: 37,
    marginBottom: 23,
  },
  eyebrow: {
    color: '#64836D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  heading: {
    color: '#292923',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  description: {
    maxWidth: 310,
    color: '#77746C',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 11,
  },
  writeButton: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#56735D',
  },
  writeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  writeIconText: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '300',
  },
  writeCopy: {
    flex: 1,
    marginLeft: 12,
  },
  writeTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  writeSubtitle: {
    color: '#E0E9E1',
    fontSize: 12,
    marginTop: 3,
  },
  writeArrow: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#EAEDE3',
  },
  summaryLabel: {
    color: '#77796E',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  summaryNumber: {
    color: '#394A3B',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
  },
  summaryCopy: {
    color: '#77796E',
    fontSize: 12,
    marginTop: 1,
  },
  summaryArt: {
    minWidth: 100,
    height: 67,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#F7F5F0',
  },
  summaryEmoji: {
    fontSize: 25,
  },
  summaryArtText: {
    color: '#64725E',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 11,
  },
  filterTitle: {
    color: '#302F29',
    fontSize: 15,
    fontWeight: '700',
  },
  filterSubtitle: {
    color: '#8A887F',
    fontSize: 11,
    marginTop: 3,
  },
  resetFilter: {
    color: '#56735D',
    fontSize: 11,
    fontWeight: '700',
  },
  searchBox: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  searchIcon: {
    color: '#77746C',
    fontSize: 22,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#34332D',
    fontSize: 12,
    paddingVertical: 0,
  },
  clearSearch: {
    color: '#8B887F',
    fontSize: 22,
    paddingLeft: 8,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 29,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#302F29',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#8A887F',
    fontSize: 12,
    marginTop: 4,
  },
  seeAll: {
    color: '#56735D',
    fontSize: 12,
    fontWeight: '700',
    paddingBottom: 2,
  },
  messageCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  messageText: {
    color: '#77746C',
    fontSize: 13,
  },
  errorText: {
    color: '#A94338',
    fontSize: 13,
    lineHeight: 19,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 5,
  },
  retryText: {
    color: '#56735D',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyReset: {
    marginTop: 13,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: '#EAEDE3',
  },
  emptyResetText: {
    color: '#56735D',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 10,
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
  privacyNote: {
    color: '#96938B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});
