import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DiaryEntry, getMood } from '@/lib/diary';
import { useLikedEntriesStore } from '@/providers/LikedEntriesProvider';

export default function DiaryEntryCard({ entry }: { entry: DiaryEntry }) {
  const mood = getMood(entry.mood);
  const { likedIds, loadingLikes, pendingLikeIds, toggleLike } = useLikedEntriesStore();
  const isLiked = likedIds.has(entry.id);
  const isPending = pendingLikeIds.has(entry.id);
  const date = new Date(entry.createdAt);
  const dateLabel = Number.isNaN(date.getTime())
    ? 'Tanggal tidak tersedia'
    : new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.date}>{dateLabel}</Text>
        <View style={styles.cardActions}>
          <View style={[styles.moodBadge, { backgroundColor: `${mood.color}20` }]}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isLiked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
            accessibilityState={{ selected: isLiked, disabled: loadingLikes || isPending }}
            disabled={loadingLikes || isPending}
            hitSlop={8}
            onPress={() => void toggleLike(entry.id)}
            style={styles.likeButton}>
            <Text style={[styles.heart, isLiked && styles.heartLiked]}>
              {isLiked ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
      </View>
      <Link
        href={{ pathname: '/entry/[id]', params: { id: String(entry.id) } }}
        asChild>
        <Pressable accessibilityRole="link" style={styles.storyLink}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.body} numberOfLines={3}>
            {entry.body}
          </Text>
          <Text style={styles.readMore}>Baca cerita ›</Text>
        </Pressable>
      </Link>
      <View style={styles.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    padding: 18,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  likeButton: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F7F5F0',
  },
  heart: {
    color: '#88847B',
    fontSize: 19,
    lineHeight: 22,
  },
  heartLiked: {
    color: '#C45C54',
  },
  storyLink: {
    paddingVertical: 1,
  },
  date: {
    flexShrink: 1,
    color: '#928E86',
    fontSize: 12,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 99,
  },
  moodEmoji: {
    fontSize: 12,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: '#292923',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: '#69675F',
    fontSize: 14,
    lineHeight: 21,
  },
  readMore: {
    color: '#56735D',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 9,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 16,
    width: 3,
    backgroundColor: '#64836D',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});
