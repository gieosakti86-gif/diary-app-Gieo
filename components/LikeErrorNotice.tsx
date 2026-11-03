import { StyleSheet, Text } from 'react-native';

export default function LikeErrorNotice({ message }: { message: string | null }) {
  if (!message) return null;

  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#A94338',
    backgroundColor: '#FCEBE8',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
});
