import { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";

import { calculatePortionData } from "../../utils/portionUtils";

export function useReportScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [showFatDetails, setShowFatDetails] = useState(false);
  const [showSaltDetails, setShowSaltDetails] = useState(false);

  // console.log(
  //   "Params recibidos en ReportScreen",
  //   JSON.stringify(route.params, null, 2)
  // );

  const { product, source } = route.params || {};

  // ---------------------------------------------------------
  // Información básica del producto
  // ---------------------------------------------------------

  const name =
    product?.name ||
    product?.product_name ||
    "Producto Desconocido";

  console.log("Nombre del producto: " + name);

  const brand =
    product?.brand ||
    product?.brands ||
    "Marca no especificada";

  // ---------------------------------------------------------
  // Cantidad total del producto
  // ---------------------------------------------------------

  const cantidadProduct = product?.quantityData || {};

  const cantidad = cantidadProduct.display || "";

  console.log("Cantidad: " + cantidad);

  // ---------------------------------------------------------
  // Imagen
  // ---------------------------------------------------------

  const imageUrl =
    product?.imageUrl ||
    product?.image_front_url ||
    product?.image_url;

  // ---------------------------------------------------------
  // Cantidad numérica y unidad del producto
  // ---------------------------------------------------------

  const quantityNum =
    product?.quantityNum ||
    product?.product_quantity ||
    0;

  /**
   * IMPORTANTE:
   *
   * quantityUnit sigue viniendo de quantityData.
   *
   * NO lo cambiamos por servingQuantityData.unit porque
   * quantityUnit representa la unidad utilizada para los
   * valores nutricionales por 100 g / 100 ml.
   */
  const quantityUnit = (
    product?.quantityData?.unit ||
    "g"
  ).toLowerCase();

  console.log("quantityUnit = " + quantityUnit);

  // ---------------------------------------------------------
  // Valores nutricionales
  // ---------------------------------------------------------

  const nutriments = product?.nutritionalData || {};

  console.log(
    "Azucar " + (nutriments?.sugars?.value ?? 0)
  );

  console.log(
    "GrasasTotales " + (nutriments?.totalFat?.value ?? 0)
  );

  console.log(
    "GrasasSaturadas " +
      (nutriments?.saturatedFat?.value ?? 0)
  );

  console.log(
    "Sal " + (nutriments?.salt?.value ?? 0)
  );

  const sugars100 = nutriments?.sugars?.value ?? 0;
  const fat100 = nutriments?.totalFat?.value ?? 0;
  const satFat100 =
    nutriments?.saturatedFat?.value ?? 0;
  const salt100 = nutriments?.salt?.value ?? 0;

  // ---------------------------------------------------------
  // Semáforo
  // ---------------------------------------------------------

  const levels = product?.nutrientLevels || {};

  console.log("level: " + levels.fat);

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

  const portionData = calculatePortionData(
    product?.servingQuantityData,
    sugars100
  );

  const {
    servingDisplay,
    servingValue,
    servingUnit,
    hasServingInformation,
    sugarPerPortion,
    teaspoons,
  } = portionData;

  console.log(
    "Serving display: " + servingDisplay
  );

  console.log(
    "Serving value: " + servingValue
  );

  console.log(
    "Serving unit: " + servingUnit
  );

  console.log(
    "Tiene información de porción: " +
      hasServingInformation
  );

  console.log(
    "Azúcar por porción: " +
      sugarPerPortion
  );

  console.log(
    "Cucharaditas: " +
      teaspoons
  );

  // ---------------------------------------------------------
  // Funciones auxiliares
  // ---------------------------------------------------------

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH":
      case "ALTO":
        return {
          bg: "#FF3B30",
          text: "#FFFFFF",
        };

      case "MODERATE":
      case "MEDIO":
        return {
          bg: "#FFCC00",
          text: "#000000",
        };

      case "LOW":
      case "BAJO":
      default:
        return {
          bg: "#34C759",
          text: "#FFFFFF",
        };
    }
  };

  const translateLevel = (level: string) => {
    if (level === "HIGH" || level === "ALTO") {
      return "ALTO";
    }

    if (
      level === "MODERATE" ||
      level === "MEDIO"
    ) {
      return "MEDIO";
    }

    return "BAJO";
  };

  // ---------------------------------------------------------
  // Datos que devuelve el hook
  // ---------------------------------------------------------

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
    showFatDetails,
    setShowFatDetails,
    showSaltDetails,
    setShowSaltDetails,
    getBadgeColor,
    translateLevel,
    goBack: navigation.goBack,
  };
}