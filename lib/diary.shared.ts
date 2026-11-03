export const MOODS = [
  { value: 'bahagia', label: 'Bahagia', emoji: '😊', color: '#E8B84A' },
  { value: 'tenang', label: 'Tenang', emoji: '😌', color: '#75A88A' },
  { value: 'bersyukur', label: 'Bersyukur', emoji: '🙏', color: '#8D83C6' },
  { value: 'lelah', label: 'Lelah', emoji: '😮‍💨', color: '#D49165' },
  { value: 'sedih', label: 'Sedih', emoji: '🌧️', color: '#7295B8' },
] as const;

export type Mood = (typeof MOODS)[number]['value'];

export type DiaryEntry = {
  id: number;
  title: string;
  body: string;
  mood: Mood;
  createdAt: string;
};

export function getMood(mood: Mood) {
  return MOODS.find((item) => item.value === mood) ?? MOODS[1];
}
