import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { addDiaryEntry, MOODS, Mood } from '@/lib/diary';

export default function NewEntryScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood>('tenang');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = title.trim().length > 0 && body.trim().length > 0 && !saving;

  async function saveEntry() {
    if (!canSave) return;

    setSaving(true);
    setError(null);
    try {
      await addDiaryEntry(title, body, mood);
      router.back();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Catatan belum berhasil disimpan. Silakan coba lagi.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen options={{ title: 'Catatan baru', headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Tutup">
                <Text style={styles.closeText}>×</Text>
              </Pressable>
              <Text style={styles.headerTitle}>Catatan baru</Text>
              <View style={styles.headerSpacer} />
            </View>

            <Text style={styles.eyebrow}>TULIS TANPA TERBURU-BURU</Text>
            <Text style={styles.heading}>Apa yang ingin kamu{'\n'}ceritakan?</Text>
            <Text style={styles.date}>
              {new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date())}
            </Text>

            <Text style={styles.label}>Judul cerita</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Beri nama untuk ceritamu"
              placeholderTextColor="#A19D93"
              maxLength={80}
              style={styles.titleInput}
              accessibilityLabel="Judul cerita"
              returnKeyType="next"
            />

            <Text style={[styles.label, styles.storyLabel]}>Ceritakan harimu</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Tulis apa pun yang terasa penting. Tidak ada cara yang salah..."
              placeholderTextColor="#A19D93"
              multiline
              textAlignVertical="top"
              maxLength={3000}
              style={styles.bodyInput}
              accessibilityLabel="Isi cerita"
            />
            <Text style={styles.characterCount}>{body.length}/3000</Text>

            <Text style={styles.label}>Suasana hatimu</Text>
            <View style={styles.moods}>
              {MOODS.map((item) => {
                const selected = mood === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setMood(item.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.moodChoice,
                      selected && {
                        backgroundColor: `${item.color}1A`,
                        borderColor: item.color,
                      },
                    ]}>
                    <Text style={styles.moodEmoji}>{item.emoji}</Text>
                    <Text style={[styles.moodText, selected && { color: item.color }]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              onPress={() => void saveEntry()}
              disabled={!canSave}
              accessibilityRole="button"
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}>
              <Text style={styles.saveButtonText}>
                {saving ? 'Menyimpan...' : 'Simpan cerita'}
              </Text>
              {!saving && <Text style={styles.saveArrow}>→</Text>}
            </Pressable>
            <Text style={styles.privacyNote}>Cerita ini hanya tersimpan di perangkatmu.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 22,
  },
  header: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 22,
  },
  closeButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  closeText: {
    color: '#625F57',
    fontSize: 25,
    lineHeight: 28,
  },
  headerTitle: {
    color: '#34332D',
    fontSize: 14,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 38,
  },
  eyebrow: {
    color: '#64836D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heading: {
    color: '#292923',
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: 8,
  },
  date: {
    color: '#8A887F',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    color: '#49473F',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
    color: '#34332D',
    fontSize: 14,
  },
  storyLabel: {
    marginTop: 18,
  },
  bodyInput: {
    minHeight: 150,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
    color: '#34332D',
    fontSize: 14,
    lineHeight: 21,
  },
  characterCount: {
    color: '#96938B',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 5,
    marginBottom: 17,
  },
  moods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodChoice: {
    minWidth: 91,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEAE3',
  },
  moodEmoji: {
    fontSize: 15,
  },
  moodText: {
    color: '#6E6B63',
    fontSize: 11,
    fontWeight: '600',
  },
  errorText: {
    color: '#A94338',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },
  saveButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
    borderRadius: 16,
    backgroundColor: '#56735D',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  saveArrow: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  privacyNote: {
    color: '#96938B',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 11,
  },
});
