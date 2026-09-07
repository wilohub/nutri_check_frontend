import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    position: 'absolute',
    top: 60,
    letterSpacing: 0.5,
  },
  scanSubtitle: {
    fontSize: 14,
    color: '#E5E5EA',
    position: 'absolute',
    top: 105,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanTarget: {
    width: width * 0.78,
    height: 190,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 180,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '500',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
});
