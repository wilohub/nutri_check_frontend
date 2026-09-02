import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { productService } from '../../services/api';

export function useCreateProductScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { ocrData, barcode } = route.params || {};

  // Estados del Formulario precargados desde OCR
  const [barcodeInput, setBarcodeInput] = useState(barcode || ocrData?.barcode || '');
  const [name, setName] = useState(ocrData?.name || '');
  const [brand, setBrand] = useState(ocrData?.brand || '');
  const [ingredients, setIngredients] = useState(ocrData?.ingredients || '');
  const [quantityDisplay, setQuantityDisplay] = useState(ocrData?.quantityData?.display || '');

  // Valores Nutricionales por 100g/ml
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
  const [salt, setSalt] = useState(String(ocrData?.nutritionalData?.salt?.value ?? ''));
  const [sodium, setSodium] = useState(String(ocrData?.nutritionalData?.sodium?.value ?? ''));

  const [saving, setSaving] = useState(false);

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
      const payload = {
        barcode: barcodeInput.trim(),
        name: name.trim(),
        brand: brand.trim() || 'Genérica',
        ingredients: ingredients.trim() || 'No especificados',
        quantityData: {
          display: quantityDisplay.trim() || null,
        },
        nutritionalData: {
          energyKcal: Number(energyKcal) || 0,
          carbohydrates: Number(carbohydrates) || 0,
          sugars: Number(sugars) || 0,
          proteins: Number(proteins) || 0,
          totalFat: Number(totalFat) || 0,
          saturatedFat: Number(saturatedFat) || 0,
          salt: Number(salt) || 0,
          sodium: Number(sodium) || 0,
        },
      };

      const newProduct = await productService.createLocalProduct(payload);

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
      Alert.alert('Error', error.message || 'No se pudo guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  return {
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
    salt,
    setSalt,
    sodium,
    setSodium,
    saving,
    handleSaveProduct,
    goBack: navigation.goBack,
  };
}
