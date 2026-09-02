import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'; // <-- AGREGADO
import { productService } from '../services/api';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const navigation = useNavigation<any>(); // <-- AGREGADO
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analizando...');

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    setScanned(true);
    setLoading(true);

    try {
      setLoadingMessage('Buscando en DB Local...');
      const localResponse = await productService.scanProductLocal(result.data);

      // Redirigir a ReportScreen con los datos locales
      navigation.navigate('Report', {
        product: localResponse.data,
        source: 'local',
      });
    } catch (localError: any) {
      setLoadingMessage('Buscando en OFF...');

      try {
        const offResponse = await productService.scanProductOFF(result.data);

        // Redirigir a ReportScreen con los datos de OFF
        navigation.navigate('Report', {
          product: offResponse,
          source: 'off',
        });
      } catch (offError: any) {
        Alert.alert(
          'Producto no registrado',
          'Este alimento no existe en nuestros servidores ni en OFF.\n\n¿Deseas digitalizarlo con OCR?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => setScanned(false) },
            {
              text: 'Procesar Foto',
              onPress: () => {
                // Redirigir a la pantalla de la CÁMARA OCR pasando el código de barras
                navigation.navigate('OcrCapture', { barcode: result.data });
              },
            },
          ],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.text}>Solicitando acceso a la cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          No hay acceso a la cámara. Por favor, actívala en los ajustes.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

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
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Escanear otro producto 🔍</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: { fontSize: 15, color: '#8E8E93', marginTop: 10 },
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
  loadingText: { color: '#FFFFFF', marginTop: 8, fontWeight: '500' },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 4,
  },
  buttonText: { color: '#000000', fontSize: 15, fontWeight: '600' },
});
