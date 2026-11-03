import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LikeErrorNotice from '@/components/LikeErrorNotice';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { getMood } from '@/lib/diary';
import { useLikedEntriesStore } from '@/providers/LikedEntriesProvider';

export default function DiaryEntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, loading, error, reload } = useDiaryEntries();
  const { likedIds, loadingLikes, pendingLikeIds, likeError, toggleLike } = useLikedEntriesStore();
  const numericId = Number(id);
  const entry = Number.isSafeInteger(numericId)
    ? entries.find((item) => item.id === numericId)
    : undefined;

  const date = entry ? new Date(entry.createdAt) : null;
  const dateLabel =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date)
      : '';
  const mood = entry ? getMood(entry.mood) : null;
  const isLiked = entry ? likedIds.has(entry.id) : false;
  const likePending = entry ? pendingLikeIds.has(entry.id) : false;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.toolbar}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              hitSlop={8}
              style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            {entry && (
              <Pressable
                onPress={() => void toggleLike(entry.id)}
                disabled={loadingLikes || likePending}
                accessibilityRole="button"
                accessibilityLabel={isLiked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                accessibilityState={{ selected: isLiked, disabled: loadingLikes || likePending }}
                style={styles.likeButton}>
                <Text style={[styles.heart, isLiked && styles.heartLiked]}>
                  {isLiked ? '♥' : '♡'}
                </Text>
                <Text style={[styles.likeLabel, isLiked && styles.heartLiked]}>
                  {isLiked ? 'Tersimpan' : 'Simpan'}
                </Text>
              </Pressable>
            )}
          </View>

          {loading ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>Memuat ceritamu...</Text>
            </View>
          ) : error ? (
            <View style={styles.messageCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void reload()} style={styles.retryButton}>
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : !entry || !mood ? (
            <View style={styles.messageCard}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyTitle}>Cerita tidak ditemukan</Text>
              <Text style={styles.messageText}>Catatan ini mungkin sudah tidak tersedia.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.eyebrow}>SATU POTONGAN PERJALANANMU</Text>
              <Text style={styles.heading}>{entry.title}</Text>
              <View style={styles.metadata}>
                <Text style={styles.date}>{dateLabel}</Text>
                <View style={[styles.moodBadge, { backgroundColor: `${mood.color}20` }]}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodText, { color: mood.color }]}>{mood.label}</Text>
                </View>
              </View>

              <LikeErrorNotice message={likeError} />

              <View style={styles.storyCard}>
                <Text style={styles.story}>{entry.body}</Text>
              </View>
              <Text style={styles.privacyNote}>🔒 Cerita ini tersimpan pribadi di perangkatmu.</Text>
            </>
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
  },
  toolbar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 27,
  },
  backButton: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  backIcon: {
    color: '#625F57',
    fontSize: 30,
    lineHeight: 32,
    marginTop: -3,
  },
  likeButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  heart: {
    color: '#77746C',
    fontSize: 18,
  },
  heartLiked: {
    color: '#C45C54',
  },
  likeLabel: {
    color: '#77746C',
    fontSize: 11,
    fontWeight: '600',
  },
  eyebrow: {
    color: '#64836D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heading: {
    color: '#292923',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: 9,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  date: {
    flexShrink: 1,
    color: '#928E86',
    fontSize: 11,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
  },
  moodEmoji: {
    fontSize: 12,
  },
  moodText: {
    fontSize: 11,
    fontWeight: '600',
  },
  storyCard: {
    paddingHorizontal: 20,
    paddingVertical: 21,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  story: {
    color: '#4C4A43',
    fontSize: 15,
    lineHeight: 26,
  },
  privacyNote: {
    color: '#96938B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
  },
  messageCard: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  messageText: {
    color: '#77746C',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#A94338',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 9,
  },
  emptyTitle: {
    color: '#393832',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
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
