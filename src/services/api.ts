import axios from "axios";

// Tu IP local fija de la red actual y el puerto de NestJS
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productService = {
  /**
   * Intento 1: Buscar el producto en la DB Local de NestJS
   */
  scanProductLocal: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/products/scan/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error("Error al conectar con la DB Local");
    }
  },

  /**
   * Intento 2: Buscar el producto en la API externa de Open Food Facts (OFF)
   */
  scanProductOFF: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/open-food-facts/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error("Error al conectar con Open Food Facts");
    }
  },
};

export default api;
