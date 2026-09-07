import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Camera, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../../services/api';

export function useScanScreen() {
  const navigation = useNavigation<any>();
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

  const resetScan = () => {
    setScanned(false);
  };

  return {
    hasPermission,
    scanned,
    loading,
    loadingMessage,
    handleBarcodeScanned,
    resetScan,
  };
}
