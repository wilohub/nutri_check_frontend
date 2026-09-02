import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingTop: 50, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 13, color: '#8E8E93', marginBottom: 16, marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: { fontSize: 15, fontWeight: '700', color: '#007AFF', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: '#3A3A3C', marginBottom: 4 },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  cancelButton: { paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
});
