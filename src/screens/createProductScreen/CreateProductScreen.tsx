import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useCreateProductScreen } from './useCreateProductScreen';
import { styles } from './CreateProductScreen.styles';

export default function CreateProductScreen() {
  const {
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
    goBack,
  } = useCreateProductScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar Producto OCR</Text>
      <Text style={styles.subtitle}>
        Revisa y corrige los datos extraídos de la foto antes de guardar.
      </Text>

      {/* Información General */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Información Básica</Text>

        {/* Recuadro interactivo de Foto del Producto */}
        <Text style={styles.label}>Foto del Producto (Opcional)</Text>
        <TouchableOpacity
          style={styles.imagePickerContainer}
          onPress={selectImagePrompt}
          activeOpacity={0.8}
        >
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.removeImageButtonText}>✕</Text>
              </TouchableOpacity>
              <View style={styles.changePhotoBadge}>
                <Text style={styles.changePhotoText}>Cambiar foto 📷</Text>
              </View>
            </View>
          ) : (
            <View style={styles.imagePickerPlaceholder}>
              <Text style={styles.imagePickerIcon}>📷</Text>
              <Text style={styles.imagePickerText}>Foto del producto (opcional)</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Código de Barras *</Text>
        <TextInput
          style={styles.input}
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nombre del Producto *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej: Ruffles Jamón"
        />

        <Text style={styles.label}>Marca</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="Ej: Pepsico"
        />

        <Text style={styles.label}>Presentación (Cantidad)</Text>
        <TextInput
          style={styles.input}
          value={quantityDisplay}
          onChangeText={setQuantityDisplay}
          placeholder="Ej: 150 g"
        />

        <Text style={styles.label}>Ingredientes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Valores Nutricionales por 100g */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Valores Nutricionales (por 100g / 100ml)</Text>

        <Text style={styles.label}>Calorías (kcal)</Text>
        <TextInput
          style={styles.input}
          value={energyKcal}
          onChangeText={setEnergyKcal}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Carbohidratos (g)</Text>
        <TextInput
          style={styles.input}
          value={carbohydrates}
          onChangeText={setCarbohydrates}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Azúcares (g)</Text>
        <TextInput
          style={styles.input}
          value={sugars}
          onChangeText={setSugars}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Proteínas (g)</Text>
        <TextInput
          style={styles.input}
          value={proteins}
          onChangeText={setProteins}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Grasas Totales (g)</Text>
        <TextInput
          style={styles.input}
          value={totalFat}
          onChangeText={setTotalFat}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Grasas Saturadas (g)</Text>
        <TextInput
          style={styles.input}
          value={saturatedFat}
          onChangeText={setSaturatedFat}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Fibra (g)</Text>
        <TextInput
          style={styles.input}
          value={fiber}
          onChangeText={setFiber}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Sal (g)</Text>
        <TextInput
          style={styles.input}
          value={salt}
          onChangeText={setSalt}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Sodio (g)</Text>
        <TextInput
          style={styles.input}
          value={sodium}
          onChangeText={setSodium}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Acciones */}
      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSaveProduct}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <View style={styles.saveButtonContent}>
            <ActivityIndicator color="#FFF" size="small" />
            <Text style={styles.saveButtonText}>Guardando producto...</Text>
          </View>
        ) : (
          <Text style={styles.saveButtonText}>Guardar Producto 💾</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={goBack} disabled={saving}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
