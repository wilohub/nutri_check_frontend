import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { calculatePortionData } from '../../utils/portionUtils';
import { productService } from '../../services/api';

export function useReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [showFatDetails, setShowFatDetails] = useState(false);
  const [showSaltDetails, setShowSaltDetails] = useState(false);

  // console.log('Params recibidos en ReportScreen', JSON.stringify(route.params, null, 2));

  const { product, source } = route.params || {};

  const barcode = product?.barcode || product?.code || route.params?.barcode || '';

  // ---------------------------------------------------------
  // Información básica del producto
  // ---------------------------------------------------------

  const name = product?.name || product?.product_name || 'Producto Desconocido';
  console.log('Nombre del producto: ' + name);
  const brand = product?.brand || product?.brands || 'Marca no especificada';

  // ---------------------------------------------------------
  // Cantidad total del producto
  // ---------------------------------------------------------

  const cantidadProduct = product?.quantityData || {};
  const cantidad = cantidadProduct.display || '';
  console.log('Cantidad: ' + cantidad);

  // ---------------------------------------------------------
  // Imagen y Estado reactivo de actualización directa
  // ---------------------------------------------------------

  const initialImageUrl =
    product?.imageUrl || product?.image_front_url || product?.image_url || null;
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialImageUrl);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // ---------------------------------------------------------
  // Cantidad numérica y unidad del producto
  // ---------------------------------------------------------

  const quantityNum = product?.quantityNum || product?.product_quantity || 0;

  /**
   * IMPORTANTE:
   *
   * quantityUnit sigue viniendo de quantityData.
   *
   * NO lo cambiamos por servingQuantityData.unit porque
   * quantityUnit representa la unidad utilizada para los
   * valores nutricionales por 100 g / 100 ml.
   */
  const quantityUnit = (product?.quantityData?.unit || 'g').toLowerCase();

  console.log('quantityUnit = ' + quantityUnit);

  // ---------------------------------------------------------
  // Valores nutricionales
  // ---------------------------------------------------------

  const nutriments = product?.nutritionalData || {};

  console.log('Azucar ' + (nutriments?.sugars?.value ?? 0));

  console.log('GrasasTotales ' + (nutriments?.totalFat?.value ?? 0));

  console.log('GrasasSaturadas ' + (nutriments?.saturatedFat?.value ?? 0));

  console.log('Sal ' + (nutriments?.salt?.value ?? 0));

  const sugars100 = nutriments?.sugars?.value ?? 0;
  const fat100 = nutriments?.totalFat?.value ?? 0;
  const satFat100 = nutriments?.saturatedFat?.value ?? 0;
  const salt100 = nutriments?.salt?.value ?? 0;
  const sodium100 = nutriments?.sodium?.value ?? 0;

  const hasFatInfo = Number(fat100) > 0 || Number(satFat100) > 0;
  const hasSaltInfo = Number(salt100) > 0 || Number(sodium100) > 0;

  // ---------------------------------------------------------
  // Semáforo
  // ---------------------------------------------------------

  const levels = product?.nutrientLevels || {};

  console.log('level: ' + levels.fat);

  const sugarLevel = (
    product?.trafficLight?.sugar ||
    levels['sugars'] ||
    nutriments?.trafficLightSugar ||
    'BAJO'
  ).toUpperCase();

  const fatLevel = (
    product?.trafficLight?.satFat ||
    levels['saturatedFat'] ||
    nutriments?.trafficLightSaturatedFat ||
    'BAJO'
  ).toUpperCase();

  const sodiumLevel = (
    product?.trafficLight?.sodium ||
    levels['salt'] ||
    nutriments?.trafficLightSodium ||
    'BAJO'
  ).toUpperCase();

  // ---------------------------------------------------------
  // Información de porción
  // ---------------------------------------------------------

  /**
   * Aquí obtenemos la información real proporcionada
   * por el producto.
   *
   * Ejemplo Coca-Cola:
   *
   * servingQuantityData: {
   *   display: "250 ml",
   *   value: 250,
   *   unit: "ml"
   * }
   *
   * Ejemplo Pringles:
   *
   * servingQuantityData: {
   *   display: "1 serving (30 g)",
   *   value: 30,
   *   unit: "g"
   * }
   *
   * Si devuelve:
   *
   * servingQuantityData: {}
   *
   * no se inventa ninguna porción.
   */

  const portionData = calculatePortionData(product?.servingQuantityData, sugars100);

  const {
    servingDisplay,
    servingValue,
    servingUnit,
    hasServingInformation,
    sugarPerPortion,
    teaspoons,
  } = portionData;

  console.log('Serving display: ' + servingDisplay);
  console.log('Serving value: ' + servingValue);

  console.log('Serving unit: ' + servingUnit);
  console.log('Tiene información de porción: ' + hasServingInformation);
  console.log('Azúcar por porción: ' + sugarPerPortion);
  console.log('Cucharaditas: ' + teaspoons);

  // ---------------------------------------------------------
  // Funciones auxiliares
  // ---------------------------------------------------------

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'HIGH':
      case 'ALTO':
        return {
          bg: '#FF3B30',
          text: '#FFFFFF',
        };

      case 'MODERATE':
      case 'MEDIO':
        return {
          bg: '#FFCC00',
          text: '#000000',
        };

      case 'LOW':
      case 'BAJO':
      default:
        return {
          bg: '#34C759',
          text: '#FFFFFF',
        };
    }
  };

  const translateLevel = (level: string) => {
    if (level === 'HIGH' || level === 'ALTO') {
      return 'ALTO';
    }
    if (level === 'MODERATE' || level === 'MEDIO') {
      return 'MEDIO';
    }
    return 'BAJO';
  };

  // ---------------------------------------------------------
  // Gestión de actualización de imagen (Cámara / Galería / Cloudinary)
  // ---------------------------------------------------------

  const uploadImageFromUri = async (uri: string) => {
    const cleanBarcode = (barcode || '').trim();
    if (!cleanBarcode) {
      Alert.alert(
        'Código no disponible',
        'No se encontró el código de barras del producto para actualizar su imagen.',
      );
      return;
    }

    setIsUploadingImage(true);

    try {
      const filename = uri.split('/').pop() || `product_${cleanBarcode}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: `product_${cleanBarcode}.jpg`,
        type,
      } as any);

      const response = await productService.updateProductImage(cleanBarcode, formData);

      // Al recibir la respuesta exitosa (código 200), actualiza de inmediato el estado local del producto
      const newUrl = response?.imageUrl || response?.data?.imageUrl || uri;
      setCurrentImageUrl(newUrl);

      Alert.alert('¡Foto Actualizada!', 'La imagen del producto se guardó y subió correctamente.');
    } catch (error: any) {
      const message =
        error?.message || error?.response?.data?.message || 'No se pudo actualizar la imagen.';
      Alert.alert('Error al subir imagen', message);
    } finally {
      setIsUploadingImage(false);
    }
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
        await uploadImageFromUri(result.assets[0].uri);
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
        await uploadImageFromUri(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo abrir la galería: ' + (error.message || error));
    }
  };

  const openImagePickerPrompt = () => {
    if (isUploadingImage) return;

    Alert.alert(
      'Actualizar Foto del Producto',
      'Elige el origen de la imagen:',
      [
        { text: 'Tomar Foto con Cámara', onPress: pickImageFromCamera },
        { text: 'Elegir de Galería', onPress: pickImageFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  // ---------------------------------------------------------
  // Datos que devuelve el hook
  // ---------------------------------------------------------

  return {
    source,
    name,
    brand,
    cantidad,
    imageUrl: currentImageUrl,
    isUploadingImage,
    openImagePickerPrompt,
    quantityNum,
    quantityUnit,
    sugars100,
    fat100,
    satFat100,
    salt100,
    sugarLevel,
    fatLevel,
    sodiumLevel,
    // Información de porción
    servingDisplay,
    servingValue,
    servingUnit,
    hasServingInformation,
    sugarPerPortion,
    teaspoons,
    hasFatInfo,
    hasSaltInfo,
    showFatDetails,
    setShowFatDetails,
    showSaltDetails,
    setShowSaltDetails,
    getBadgeColor,
    translateLevel,
    goBack: navigation.goBack,
  };
}
