import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { productService } from '../services/api';

const { width } = Dimensions.get('window');

export default function ScanScreen() {
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

    // Lógica de cascada inteligente conectada a NestJS
    const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
        setScanned(true);
        setLoading(true);

        try {
            setLoadingMessage('Buscando en DB Local...');
            console.log(`Paso 1: Buscando ${result.data} en DB Local...`);
            const localResponse = await productService.scanProductLocal(result.data);

            // Si existe localmente, el backend devuelve { source: 'local', data: { ... } }
            Alert.alert(
                '¡Producto Encontrado Local!',
                `Nombre: ${localResponse.data.name}\nOrigen: Base de datos Nutri-Check`
            );
            // TODO: Aquí navegaremos a la pantalla de Reporte con el Semáforo
            // navigation.navigate('Report', { product: localResponse.data });

        } catch (localError: any) {
            // Si dio 404 (No encontrado local), pasamos automáticamente a Open Food Facts
            console.log(`Paso 2: No está local. Buscando ${result.data} en Open Food Facts...`);
            setLoadingMessage('Buscando en OFF...');

            try {
                const offResponse = await productService.scanProductOFF(result.data);

                Alert.alert(
                    '¡Encontrado en Open Food Facts!',
                    `Nombre: ${offResponse.product_name || offResponse.name || 'Alimento registrado'}\nOrigen: API Externa`
                );
                // TODO: Aquí navegaremos a la pantalla de Reporte mapeando los datos de OFF
                // navigation.navigate('Report', { product: offResponse });

            } catch (offError: any) {
                // Si tampoco está en OFF, se activa el flujo OCR
                console.log('Paso 3: No existe en ningún lado. Cambiando a Modo OCR...');
                Alert.alert(
                    'Producto no registrado',
                    'Este alimento no existe en nuestros servidores ni en la red internacional.\n\nIniciando Asistente OCR para escanear tabla nutricional...'
                );
                // TODO: Aquí navegaremos al Wizard de OCR
                // navigation.navigate('OcrWizard', { barcode: result.data });
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
                <Text style={styles.text}>No hay acceso a la cámara. Por favor, actívala en los ajustes.</Text>
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
                <TouchableOpacity
                    style={styles.scanAgainButton}
                    onPress={() => setScanned(false)}
                >
                    <Text style={styles.buttonText}>Escanear otro producto 🔍</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    text: { fontSize: 15, color: '#8E8E93', marginTop: 10 },
    overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
    scanTitle: { fontSize: 26, fontWeight: '700', color: '#FFFFFF', position: 'absolute', top: 60, letterSpacing: 0.5 },
    scanSubtitle: { fontSize: 14, color: '#E5E5EA', position: 'absolute', top: 105, textAlign: 'center' },
    scanTarget: { width: width * 0.78, height: 190, borderWidth: 1.5, borderColor: '#FFFFFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    loadingOverlay: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 20, borderRadius: 12, alignItems: 'center', minWidth: 180 },
    loadingText: { color: '#FFFFFF', marginTop: 8, fontWeight: '500' },
    scanAgainButton: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30, elevation: 4 },
    buttonText: { color: '#000000', fontSize: 15, fontWeight: '600' },
});