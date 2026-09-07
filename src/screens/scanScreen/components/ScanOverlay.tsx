import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../ScanScreen.styles';

interface ScanOverlayProps {
  loading: boolean;
  loadingMessage: string;
  scanned: boolean;
  onScanAgain: () => void;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({
  loading,
  loadingMessage,
  scanned,
  onScanAgain,
}) => {
  return (
    <>
      <View style={styles.overlayContainer}>
        <Text style={styles.scanTitle}>Nutri-Check</Text>
        <Text style={styles.scanSubtitle}>Apunta al código de barras de un alimento</Text>

        <View style={styles.scanTarget}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>{loadingMessage}</Text>
            </View>
          )}
        </View>
      </View>

      {scanned && !loading && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Escanear otro producto 🔍</Text>
        </TouchableOpacity>
      )}
    </>
  );
};
