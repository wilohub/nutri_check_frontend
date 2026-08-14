import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Extraer parámetros enviados al navegar
  const { product, source } = route.params || {};

  // Normalización de datos
  const name = product?.name || product?.product_name || "Producto Desconocido";
  const brand = product?.brand || product?.brands || "Marca no especificada";

  // Extraer semáforo
  const nut = product?.nutritionalData || {};
  const sugarLevel = nut?.trafficLightSugar || "BAJO";
  const fatLevel = nut?.trafficLightSaturatedFat || "BAJO";
  const sodiumLevel = nut?.trafficLightSodium || "BAJO";

  const getBadgeColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "ALTO":
        return { bg: "#FF3B30", text: "#FFFFFF" };
      case "MEDIO":
        return { bg: "#FFCC00", text: "#000000" };
      case "BAJO":
      default:
        return { bg: "#34C759", text: "#FFFFFF" };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Encabezado del Producto */}
      <View style={styles.headerCard}>
        <Text style={styles.sourceTag}>
          {source === "local"
            ? "🟢 Base de Datos Nutri-Check"
            : "🔵 Open Food Facts"}
        </Text>
        <Text style={styles.productTitle}>{name}</Text>
        <Text style={styles.productBrand}>{brand}</Text>
      </View>

      {/* Semáforo Nutricional */}
      <Text style={styles.sectionTitle}>Evaluación por Semáforo</Text>
      <View style={styles.semaphoreContainer}>
        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Azúcares</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(sugarLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(sugarLevel).text },
              ]}
            >
              {sugarLevel}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Grasas Sat.</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(fatLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(fatLevel).text },
              ]}
            >
              {fatLevel}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Sodio</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(sodiumLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(sodiumLevel).text },
              ]}
            >
              {sodiumLevel}
            </Text>
          </View>
        </View>
      </View>

      {/* Nota Pedagógica */}
      <View style={styles.educationalCard}>
        <Text style={styles.educationalTitle}>💡 Nota Nutricional</Text>
        <Text style={styles.educationalText}>
          {sugarLevel === "ALTO"
            ? "Este producto supera el límite recomendado de azúcar. Consúmelo con moderación."
            : "Este producto tiene niveles controlados de nutrientes. Opción adecuada para el consumo habitual."}
        </Text>
      </View>

      {/* Botón Volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Escanear otro producto 🔍</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  content: { padding: 20, paddingTop: 60, alignItems: "center" },
  headerCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sourceTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 6,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  productBrand: { fontSize: 16, color: "#6C6C70" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  semaphoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  nutrientCard: {
    width: (width - 60) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 1,
  },
  nutrientLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#3A3A3C",
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  educationalCard: {
    width: "100%",
    backgroundColor: "#E5F0FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    marginBottom: 30,
  },
  educationalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  educationalText: { fontSize: 13, color: "#1C1C1E", lineHeight: 18 },
  backButton: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
