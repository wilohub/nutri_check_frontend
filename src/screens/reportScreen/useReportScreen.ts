import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";

export function useReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [showFatDetails, setShowFatDetails] = useState(false);
  const [showSaltDetails, setShowSaltDetails] = useState(false);

  console.log("Params recibicos en repostScreen", JSON.stringify(route.params, null, 2))

  const { product, source } = route.params || {};

  // Mapeo defensivo
  const name = product?.name || product?.product_name || "Producto Desconocido";
  console.log("Nombre del producto " + name);

  const brand = product?.brand || product?.brands || "Marca no especificada";
  const cantidadProduct = product?.quantityData || product?.quantityData || {};
  const cantidad = cantidadProduct.display;

  console.log("cantidad: " + cantidad )

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
  // console.log("Azucar " + nutriments.sugars)

  const sugars100 = nutriments.sugars ??  0;
  
  const fat100 =  nutriments?.totalFat ?? 0;
  
  const satFat100 = nutriments?.saturatedFat ?? 0;

  const sodium100 = nutriments?.sodium ??  0;

  // Semáforo
  const levels = product?.nutrientLevels || {};
  console.log("level: " + levels.fat)
  const sugarLevel = (
    product?.trafficLight?.sugar ||
    levels["sugars"] ||
    nutriments?.trafficLightSugar ||
    "BAJO"
  ).toUpperCase();
  const fatLevel = (
    product?.trafficLight?.satFat ||
    levels["saturatedFat"] ||
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
    cantidad,
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
