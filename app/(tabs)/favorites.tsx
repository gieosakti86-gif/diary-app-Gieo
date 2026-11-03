import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DiaryEntryCard from '@/components/DiaryEntryCard';
import LikeErrorNotice from '@/components/LikeErrorNotice';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { useLikedEntries } from '@/hooks/useLikedEntries';
import { useLikedEntriesStore } from '@/providers/LikedEntriesProvider';

export default function FavoritesScreen() {
  const { entries, loading, error, reload } = useDiaryEntries();
  const { likedIds, loadingLikes, likeError } = useLikedEntriesStore();
  const favorites = useLikedEntries(entries, likedIds);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>CERITA YANG KAMU SIMPAN</Text>
            <Text style={styles.heart}>♥</Text>
          </View>
          <Text style={styles.heading}>Favoritmu</Text>
          <Text style={styles.description}>
            {favorites.length === 1
              ? '1 cerita pilihan, tersimpan dekat.'
              : `${favorites.length} cerita pilihan, tersimpan dekat.`}
          </Text>

          <View style={styles.noteCard}>
            <Text style={styles.noteIcon}>♡</Text>
            <Text style={styles.noteText}>
              Tekan ikon hati pada cerita untuk menyimpannya di sini.
            </Text>
          </View>

          <LikeErrorNotice message={likeError} />
          {loading || loadingLikes ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCopy}>Memuat cerita favorit...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void reload()} style={styles.retryButton}>
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : favorites.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>💛</Text>
              <Text style={styles.emptyTitle}>Belum ada cerita favorit</Text>
              <Text style={styles.emptyCopy}>
                Simpan cerita yang ingin kamu baca kembali. Ceritanya akan muncul di halaman ini.
              </Text>
              <Link href="/" asChild>
                <Pressable style={styles.browseButton}>
                  <Text style={styles.browseText}>Jelajahi jurnal</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            favorites.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)
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
    paddingTop: 23,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  eyebrow: {
    color: '#64836D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heart: {
    color: '#C45C54',
    fontSize: 13,
  },
  heading: {
    color: '#292923',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  description: {
    color: '#77746C',
    fontSize: 13,
    marginTop: 6,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    marginTop: 21,
    marginBottom: 22,
    borderRadius: 17,
    backgroundColor: '#EAEDE3',
  },
  noteIcon: {
    color: '#56735D',
    fontSize: 23,
  },
  noteText: {
    flex: 1,
    color: '#64725E',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 28,
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
  browseButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: '#56735D',
  },
  browseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
