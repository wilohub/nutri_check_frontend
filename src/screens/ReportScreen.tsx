import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [showFatDetails, setShowFatDetails] = useState(false);
  const [showSaltDetails, setShowSaltDetails] = useState(false);

  const { product, source } = route.params || {};

  // Mapeo defensivo directo (funciona si viene normalizado de NestJS o directo de la API)
  const name = product?.name || product?.product_name || 'Producto Desconocido';
  const brand = product?.brand || product?.brands || 'Marca no especificada';
  const imageUrl = product?.imageUrl || product?.image_front_url || product?.image_url;
  const cantidadData = product?.quantityData || product?.quantityData || {};
  const cantidad = cantidadData?.display;

  const quantityNum = product?.quantityNum || product?.product_quantity || 0;
  const quantityUnit = (
    product?.quantityUnit ||
    product?.product_quantity_unit ||
    'g'
  ).toLowerCase();
  const isLiquid = quantityUnit === 'ml';

  // Obtención de valores nutricionales por 100g/100ml
  const nutriments = product?.nutriments || product?.nutritionalData || {};
  const sugars100 =
    product?.nutrients?.sugars100 ?? nutriments['sugars_100g'] ?? nutriments?.sugars100g ?? 0;
  const fat100 =
    product?.nutrients?.fat100 ?? nutriments['fat_100g'] ?? nutriments?.totalFat100g ?? 0;
  const satFat100 =
    product?.nutrients?.satFat100 ??
    nutriments['saturated-fat_100g'] ??
    nutriments?.saturatedFat100g ??
    0;
  const sodium100 =
    product?.nutrients?.sodium100 ?? nutriments['salt_100g'] ?? nutriments?.salt100g ?? 0;

  // Semáforo
  const levels = product?.nutrient_levels || {};
  const sugarLevel = (
    product?.trafficLight?.sugar ||
    levels['sugars'] ||
    nutriments?.trafficLightSugar ||
    'BAJO'
  ).toUpperCase();
  const fatLevel = (
    product?.trafficLight?.satFat ||
    levels['saturated-fat'] ||
    nutriments?.trafficLightSaturatedFat ||
    'BAJO'
  ).toUpperCase();
  const sodiumLevel = (
    product?.trafficLight?.sodium ||
    levels['salt'] ||
    nutriments?.trafficLightSodium ||
    'BAJO'
  ).toUpperCase();

  // Cálculos de porción y cucharaditas
  const portionSize = isLiquid ? 200 : 15;
  const portionLabel = isLiquid ? '1 vaso (200 ml)' : '1 cucharada (15 g)';
  const sugarPerPortion = ((sugars100 * portionSize) / 100).toFixed(1);
  const teaspoons = Math.round(Number(sugarPerPortion) / 4);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'HIGH':
      case 'ALTO':
        return { bg: '#FF3B30', text: '#FFFFFF' };
      case 'MODERATE':
      case 'MEDIO':
        return { bg: '#FFCC00', text: '#000000' };
      case 'LOW':
      case 'BAJO':
      default:
        return { bg: '#34C759', text: '#FFFFFF' };
    }
  };

  const translateLevel = (level: string) => {
    if (level === 'HIGH' || level === 'ALTO') return 'ALTO';
    if (level === 'MODERATE' || level === 'MEDIO') return 'MEDIO';
    return 'BAJO';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Encabezado del Producto con Imagen */}
      <View style={styles.headerCard}>
        <Text style={styles.sourceTag}>
          {source === 'local' ? '🟢 Base de Datos Nutri-Check' : '🔵 Open Food Facts'}
        </Text>
        <View style={styles.productRow}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
          )}
          <View style={styles.productInfo}>
            {/* <Text style={styles.productTitle}>{name}</Text> */}
            {/* <Text style={styles.productBrand}>Marca: {brand}</Text> */}
            <Text style={styles.productBrand}>Cantidad: {cantidad}</Text>

            {quantityNum > 0 && (
              <Text style={styles.productQuantity}>
                Contenido: {quantityNum} {quantityUnit}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Evaluación por Semáforo con Gramos */}
      {/* <Text style={styles.sectionTitle}>Evaluación por Semáforo</Text> */}
      <View style={styles.semaphoreContainer}>
        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Azúcares</Text>
          <Text style={styles.gramText}>
            {sugars100}g / 100{quantityUnit}
          </Text>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(sugarLevel).bg }]}>
            <Text style={[styles.badgeText, { color: getBadgeColor(sugarLevel).text }]}>
              {translateLevel(sugarLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Grasas Sat.</Text>
          <Text style={styles.gramText}>
            {satFat100}g / 100{quantityUnit}
          </Text>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(fatLevel).bg }]}>
            <Text style={[styles.badgeText, { color: getBadgeColor(fatLevel).text }]}>
              {translateLevel(fatLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Sodio/Sal</Text>
          <Text style={styles.gramText}>
            {sodium100}g / 100{quantityUnit}
          </Text>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(sodiumLevel).bg }]}>
            <Text style={[styles.badgeText, { color: getBadgeColor(sodiumLevel).text }]}>
              {translateLevel(sodiumLevel)}
            </Text>
          </View>
        </View>
      </View>

      {/* Equivalencia Pedagógica de Azúcar */}
      <View style={styles.educationalCard}>
        <Text style={styles.educationalTitle}>💡 Equivalencia en Azúcar</Text>
        <Text style={styles.educationalText}>
          Por cada <Text style={{ fontWeight: '700' }}>{portionLabel}</Text>, este producto contiene
          aprox.{' '}
          <Text style={{ fontWeight: '700', color: '#FF3B30' }}>{sugarPerPortion} g de azúcar</Text>
          .
        </Text>
        <View style={styles.spoonRow}>
          <Text style={styles.spoonText}>
            Equivale a: {teaspoons > 0 ? '🥄 '.repeat(Math.min(teaspoons, 8)) : '0 cucharaditas'} (
            {teaspoons} tsp)
          </Text>
        </View>
      </View>

      {/* Sección Grasas Totales Desplegable */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setShowFatDetails(!showFatDetails)}
      >
        <View style={styles.expandableHeader}>
          <Text style={styles.expandableTitle}>
            🧈 Grasas Totales ({fat100} g / 100{quantityUnit})
          </Text>
          <Text style={styles.arrow}>{showFatDetails ? '▲' : '▼'}</Text>
        </View>

        {showFatDetails && (
          <View style={styles.expandableContent}>
            <Text style={styles.fatItem}>
              🟢 <Text style={styles.bold}>Grasas monoinsaturadas:</Text> Principalmente ácido
              oleico.
            </Text>
            <Text style={styles.fatItem}>
              🟢 <Text style={styles.bold}>Grasas poliinsaturadas:</Text> Omega-6 y pequeñas
              cantidades de Omega-3.
            </Text>
            <Text style={styles.fatItem}>
              🟠 <Text style={styles.bold}>Grasas saturadas ({satFat100} g):</Text> Su consumo
              excesivo eleva el colesterol LDL ("malo") y aumenta el riesgo cardiovascular.
            </Text>
            <Text style={styles.fatItem}>
              ⚪ <Text style={styles.bold}>Grasas trans:</Text> Grasas dañinas que elevan el
              colesterol malo y reducen el bueno, elevando el riesgo cardiovascular.
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sección Sodio / Sal OMS */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setShowSaltDetails(!showSaltDetails)}
      >
        <View style={styles.expandableHeader}>
          <Text style={styles.expandableTitle}>🧂 Información de Sal y Sodio</Text>
          <Text style={styles.arrow}>{showSaltDetails ? '▲' : '▼'}</Text>
        </View>

        {showSaltDetails && (
          <View style={styles.expandableContent}>
            <Text style={styles.infoSubtitle}>¿Qué necesitas saber?</Text>
            <Text style={styles.bulletPoint}>
              • Un alto consumo de sal (o sodio) puede provocar un aumento de la presión arterial y
              el riesgo de enfermedades cardiovasculares.
            </Text>
            <Text style={styles.bulletPoint}>
              • Muchas personas con presión alta no lo saben, ya que no presenta síntomas previos.
            </Text>
            <Text style={styles.bulletPoint}>
              • La mayoría de las personas consumen de 9 a 12 g diarios de sal, el doble del límite
              recomendado (5 g/día según la OMS).
            </Text>
            <Text style={styles.sourceText}>Fuente: OMS (World Health Organization) / NHS UK</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Escanear otro producto 🔍</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20, paddingTop: 50, alignItems: 'center' },
  headerCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sourceTag: { fontSize: 11, fontWeight: '600', color: '#8E8E93', marginBottom: 10 },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productImage: { width: 75, height: 75, borderRadius: 8, marginRight: 14 },
  imagePlaceholder: { backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center' },
  productInfo: { flex: 1 },
  productTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 2 },
  productBrand: { fontSize: 14, color: '#6C6C70' },
  productQuantity: { fontSize: 13, color: '#007AFF', fontWeight: '600', marginTop: 4 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  semaphoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  nutrientCard: {
    width: (width - 56) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 1,
  },
  nutrientLabel: { fontSize: 12, fontWeight: '600', color: '#3A3A3C' },
  gramText: { fontSize: 11, color: '#8E8E93', marginVertical: 4 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  educationalCard: {
    width: '100%',
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    marginBottom: 14,
  },
  educationalTitle: { fontSize: 14, fontWeight: '700', color: '#FF9500', marginBottom: 4 },
  educationalText: { fontSize: 13, color: '#1C1C1E', lineHeight: 18 },
  spoonRow: { marginTop: 8, backgroundColor: '#FFFFFF', padding: 8, borderRadius: 8 },
  spoonText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  expandableCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  expandableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandableTitle: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  arrow: { fontSize: 12, color: '#8E8E93' },
  expandableContent: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  fatItem: { fontSize: 12, color: '#3A3A3C', marginBottom: 8, lineHeight: 16 },
  bold: { fontWeight: '700' },
  infoSubtitle: { fontSize: 13, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  bulletPoint: { fontSize: 12, color: '#3A3A3C', marginBottom: 6, lineHeight: 16 },
  sourceText: { fontSize: 10, fontStyle: 'italic', color: '#8E8E93', marginTop: 4 },
  backButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  backButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
