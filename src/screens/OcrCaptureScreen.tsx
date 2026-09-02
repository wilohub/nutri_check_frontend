import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRoute, useNavigation } from '@react-navigation/native';
import { productService } from '../services/api';

export default function OcrCaptureScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { barcode } = route.params || {};

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.text}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);

      // Reducción de calidad de la captura
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.4, // Reduce compresión (rango de 0.0 a 1.0)
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('No se obtuvo la imagen de la cámara.');
      }

      const ocrResult = await productService.processOcrImage(photo.uri, barcode);

      navigation.navigate('CreateProduct', {
        ocrData: ocrResult,
        barcode: barcode,
      });
    } catch (error: any) {
      Alert.alert('Error OCR', error.message || 'Fallo al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente Cámara sin hijos */}
      <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef} />

      {/* Capa de interfaz gráfica superpuesta mediante absolute positioning */}
      <View style={styles.overlay} pointerEvents="box-none">
        <Text style={styles.instruction}>Fotografía la tabla nutricional del producto</Text>

        <View style={styles.actionContainer}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Procesando con OCR...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
              <View style={styles.innerCaptureButton} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '600' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  instruction: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  actionContainer: { marginBottom: 30, alignItems: 'center' },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  loadingBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#1C1C1E', fontWeight: '600' },
});
