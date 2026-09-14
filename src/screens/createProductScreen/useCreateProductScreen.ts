import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { productService } from '../../services/api';

export function useCreateProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { ocrData, barcode } = route.params || {};

  // Estado de imagen del producto
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Estados del Formulario precargados desde OCR
  const [barcodeInput, setBarcodeInput] = useState(barcode || ocrData?.barcode || '');
  const [name, setName] = useState(ocrData?.name || '');
  const [brand, setBrand] = useState(ocrData?.brand || '');
  const [ingredients, setIngredients] = useState(ocrData?.ingredients || '');
  const [quantityDisplay, setQuantityDisplay] = useState(ocrData?.quantityData?.display || '');

  // Valores Nutricionales (los 9 campos requeridos por el backend)
  const [energyKcal, setEnergyKcal] = useState(
    String(ocrData?.nutritionalData?.energyKcal?.value ?? ''),
  );
  const [carbohydrates, setCarbohydrates] = useState(
    String(ocrData?.nutritionalData?.carbohydrates?.value ?? ''),
  );
  const [sugars, setSugars] = useState(String(ocrData?.nutritionalData?.sugars?.value ?? ''));
  const [proteins, setProteins] = useState(String(ocrData?.nutritionalData?.proteins?.value ?? ''));
  const [totalFat, setTotalFat] = useState(String(ocrData?.nutritionalData?.totalFat?.value ?? ''));
  const [saturatedFat, setSaturatedFat] = useState(
    String(ocrData?.nutritionalData?.saturatedFat?.value ?? ''),
  );
  const [fiber, setFiber] = useState(String(ocrData?.nutritionalData?.fiber?.value ?? ''));
  const [salt, setSalt] = useState(String(ocrData?.nutritionalData?.salt?.value ?? ''));
  const [sodium, setSodium] = useState(String(ocrData?.nutritionalData?.sodium?.value ?? ''));

  const [saving, setSaving] = useState(false);

  const formatErrorMessage = (error: any): string => {
    if (!error) return 'Ocurrió un error inesperado.';
    const rawMessage = error.message || error.response?.data?.message;

    if (Array.isArray(rawMessage)) {
      return rawMessage.join('\n• ');
    }
    if (typeof rawMessage === 'string') {
      return rawMessage;
    }
    return 'No se pudo procesar la solicitud.';
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso a la cámara para tomar la foto del producto.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo abrir la cámara: ' + (error.message || error));
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso a la galería para seleccionar la foto del producto.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo abrir la galería: ' + (error.message || error));
    }
  };

  const selectImagePrompt = () => {
    Alert.alert(
      'Foto del Producto',
      'Elige el origen de la imagen:',
      [
        { text: 'Tomar Foto con Cámara', onPress: pickImageFromCamera },
        { text: 'Elegir de Galería', onPress: pickImageFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleSaveProduct = async () => {
    if (!barcodeInput.trim()) {
      Alert.alert('Campo Requerido', 'El código de barras es obligatorio.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Campo Requerido', 'El nombre del producto es obligatorio.');
      return;
    }

    setSaving(true);

    try {
      const barcodeClean = barcodeInput.trim();
      const formData = new FormData();

      // Campos simples
      formData.append('barcode', barcodeClean);
      formData.append('name', name.trim());
      formData.append('brand', brand.trim() || 'Genérica');
      formData.append('ingredients', ingredients.trim() || 'No especificados');

      // IMPORTANTE: Convierte el objeto JavaScript nutritionalData a string mediante JSON.stringify(nutritionalData)
      const nutritionalData = {
        energyKcal: Number(energyKcal) || 0,
        carbohydrates: Number(carbohydrates) || 0,
        sugars: Number(sugars) || 0,
        proteins: Number(proteins) || 0,
        totalFat: Number(totalFat) || 0,
        saturatedFat: Number(saturatedFat) || 0,
        fiber: Number(fiber) || 0,
        salt: Number(salt) || 0,
        sodium: Number(sodium) || 0,
      };
      formData.append('nutritionalData', JSON.stringify(nutritionalData));

      // Si existe una imagen local seleccionada, ajustarla al formato esperado por FormData en React Native
      if (imageUri) {
        const filename = imageUri.split('/').pop() || `product_${barcodeClean}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

        formData.append('file', {
          uri: imageUri,
          name: `product_${barcodeClean}.jpg`,
          type,
        } as any);
      }

      const newProduct = await productService.createLocalProduct(formData);

      Alert.alert('¡Éxito!', 'Producto guardado correctamente en la DB.', [
        {
          text: 'Ver Reporte',
          onPress: () => {
            navigation.replace('Report', {
              product: newProduct,
              source: 'local',
            });
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage = formatErrorMessage(error);
      Alert.alert('Error de Validación', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return {
    imageUri,
    selectImagePrompt,
    removeImage,
    barcodeInput,
    setBarcodeInput,
    name,
    setName,
    brand,
    setBrand,
    ingredients,
    setIngredients,
    quantityDisplay,
    setQuantityDisplay,
    energyKcal,
    setEnergyKcal,
    carbohydrates,
    setCarbohydrates,
    sugars,
    setSugars,
    proteins,
    setProteins,
    totalFat,
    setTotalFat,
    saturatedFat,
    setSaturatedFat,
    fiber,
    setFiber,
    salt,
    setSalt,
    sodium,
    setSodium,
    saving,
    handleSaveProduct,
    goBack: navigation.goBack,
  };
}
