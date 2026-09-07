import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useScanScreen } from './useScanScreen';
import { ScanPermissionView } from './components/ScanPermissionView';
import { ScanOverlay } from './components/ScanOverlay';
import { styles } from './ScanScreen.styles';

export default function ScanScreen() {
  const { hasPermission, scanned, loading, loadingMessage, handleBarcodeScanned, resetScan } =
    useScanScreen();

  if (hasPermission === null || hasPermission === false) {
    return <ScanPermissionView hasPermission={hasPermission} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFill}
      />

      <ScanOverlay
        loading={loading}
        loadingMessage={loadingMessage}
        scanned={scanned}
        onScanAgain={resetScan}
      />
    </View>
  );
}
