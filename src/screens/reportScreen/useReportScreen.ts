import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";

export function useReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [showFatDetails, setShowFatDetails] = useState(false);
  const [showSaltDetails, setShowSaltDetails] = useState(false);

  const { product, source } = route.params || {};

  // Mapeo defensivo
  const name = product?.name || product?.product_name || "Producto Desconocido";
  const brand = product?.brand || product?.brands || "Marca no especificada";
  const imageUrl =
    product?.imageUrl || product?.image_front_url || product?.image_url;

  const quantityNum = product?.quantityNum || product?.product_quantity || 0;
  const quantityUnit = (
    product?.quantityUnit ||
    product?.product_quantity_unit ||
    "g"
  ).toLowerCase();
  const isLiquid = quantityUnit === "ml";

  // Obtención de valores nutricionales
  const nutriments = product?.nutriments || product?.nutritionalData || {};
  const sugars100 =
    product?.nutrients?.sugars100 ??
    nutriments["sugars_100g"] ??
    nutriments?.sugars100g ??
    0;
  const fat100 =
    product?.nutrients?.fat100 ??
    nutriments["fat_100g"] ??
    nutriments?.totalFat100g ??
    0;
  const satFat100 =
    product?.nutrients?.satFat100 ??
    nutriments["saturated-fat_100g"] ??
    nutriments?.saturatedFat100g ??
    0;
  const sodium100 =
    product?.nutrients?.sodium100 ??
    nutriments["salt_100g"] ??
    nutriments?.salt100g ??
    0;

  // Semáforo
  const levels = product?.nutrient_levels || {};
  const sugarLevel = (
    product?.trafficLight?.sugar ||
    levels["sugars"] ||
    nutriments?.trafficLightSugar ||
    "BAJO"
  ).toUpperCase();
  const fatLevel = (
    product?.trafficLight?.satFat ||
    levels["saturated-fat"] ||
    nutriments?.trafficLightSaturatedFat ||
    "BAJO"
  ).toUpperCase();
  const sodiumLevel = (
    product?.trafficLight?.sodium ||
    levels["salt"] ||
    nutriments?.trafficLightSodium ||
    "BAJO"
  ).toUpperCase();

  // Cálculos de porción y cucharaditas
  const portionSize = isLiquid ? 200 : 15;
  const portionLabel = isLiquid ? "1 vaso (200 ml)" : "1 cucharada (15 g)";
  const sugarPerPortion = ((sugars100 * portionSize) / 100).toFixed(1);
  const teaspoons = Math.round(Number(sugarPerPortion) / 4);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH":
      case "ALTO":
        return { bg: "#FF3B30", text: "#FFFFFF" };
      case "MODERATE":
      case "MEDIO":
        return { bg: "#FFCC00", text: "#000000" };
      case "LOW":
      case "BAJO":
      default:
        return { bg: "#34C759", text: "#FFFFFF" };
    }
  };

  const translateLevel = (level: string) => {
    if (level === "HIGH" || level === "ALTO") return "ALTO";
    if (level === "MODERATE" || level === "MEDIO") return "MEDIO";
    return "BAJO";
  };

  return {
    source,
    name,
    brand,
    imageUrl,
    quantityNum,
    quantityUnit,
    sugars100,
    fat100,
    satFat100,
    sodium100,
    sugarLevel,
    fatLevel,
    sodiumLevel,
    portionLabel,
    sugarPerPortion,
    teaspoons,
    showFatDetails,
    setShowFatDetails,
    showSaltDetails,
    setShowSaltDetails,
    getBadgeColor,
    translateLevel,
    goBack: navigation.goBack,
  };
}
