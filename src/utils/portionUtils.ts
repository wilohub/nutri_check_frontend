export interface ServingQuantityData {
  display?: string;
  value?: number;
  unit?: string;
}

export interface PortionResult {
  servingDisplay: string | null;
  servingValue: number | null;
  servingUnit: string | null;
  hasServingInformation: boolean;
  sugarPerPortion: string | null;
  teaspoons: number | null;
}

/**
 * Procesa la información de porción de un producto.
 *
 * Ejemplos:
 *
 * {
 *   display: "250 ml",
 *   value: 250,
 *   unit: "ml"
 * }
 *
 * o:
 *
 * {
 *   display: "1 serving (30 g)",
 *   value: 30,
 *   unit: "g"
 * }
 *
 * Si servingQuantityData está vacío o no tiene un value válido,
 * no se inventa una porción.
 */
export function calculatePortionData(
  servingQuantityData: ServingQuantityData | null | undefined,
  sugarsPer100: number | null | undefined
): PortionResult {
  const servingDisplay =
    typeof servingQuantityData?.display === "string" &&
    servingQuantityData.display.trim() !== ""
      ? servingQuantityData.display.trim()
      : null;

  const servingValue =
    typeof servingQuantityData?.value === "number" &&
    Number.isFinite(servingQuantityData.value) &&
    servingQuantityData.value > 0
      ? servingQuantityData.value
      : null;

  const servingUnit =
    typeof servingQuantityData?.unit === "string" &&
    servingQuantityData.unit.trim() !== ""
      ? servingQuantityData.unit.toLowerCase()
      : null;

  const hasServingInformation =
    servingDisplay !== null && servingValue !== null;

  // No existe información suficiente para calcular la porción.
  if (!hasServingInformation) {
    return {
      servingDisplay: servingDisplay,
      servingValue: servingValue,
      servingUnit,
      hasServingInformation: false,
      sugarPerPortion: null,
      teaspoons: null,
    };
  }

  const sugarValue =
    typeof sugarsPer100 === "number" &&
    Number.isFinite(sugarsPer100) &&
    sugarsPer100 >= 0
      ? sugarsPer100
      : 0;

  /**
   * Los valores nutricionales están expresados por 100 g/ml.
   *
   * Ejemplo:
   * 10.6 g de azúcar / 100 ml
   * Porción = 250 ml
   *
   * (10.6 * 250) / 100 = 26.5 g
   */
  const sugarPerPortionValue =
    (sugarValue * servingValue) / 100;

  const sugarPerPortion = sugarPerPortionValue.toFixed(1);

  /**
   * Aproximadamente 4 g de azúcar = 1 cucharadita.
   */
  const teaspoons = Math.round(sugarPerPortionValue / 4);

  return {
    servingDisplay,
    servingValue,
    servingUnit,
    hasServingInformation: true,
    sugarPerPortion,
    teaspoons,
  };
}