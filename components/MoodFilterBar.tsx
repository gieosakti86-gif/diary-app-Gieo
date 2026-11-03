import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { MOODS, Mood } from '@/lib/diary';

export default function MoodFilterBar({
  selectedMood,
  onSelect,
}: {
  selectedMood: Mood | null;
  onSelect: (mood: Mood | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: selectedMood === null }}
        onPress={() => onSelect(null)}
        style={[styles.chip, selectedMood === null && styles.selectedChip]}>
        <Text style={[styles.label, selectedMood === null && styles.selectedLabel]}>Semua</Text>
      </Pressable>
      {MOODS.map((mood) => {
        const selected = selectedMood === mood.value;
        return (
          <Pressable
            key={mood.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(selected ? null : mood.value)}
            style={[styles.chip, selected && styles.selectedChip]}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{mood.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: 8,
    paddingRight: 22,
  },
  chip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  selectedChip: {
    backgroundColor: '#56735D',
    borderColor: '#56735D',
  },
  emoji: {
    fontSize: 13,
  },
  label: {
    color: '#6E6B63',
    fontSize: 11,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
