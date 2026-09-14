import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Adecuado para subida de imágenes a Cloudinary
});

/**
 * Función auxiliar para normalizar errores de Axios/NestJS a una estructura estandarizada
 */
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response?.data) {
    // Retornamos la respuesta del backend manteniendo sus propiedades
    throw error.response.data;
  }
  throw new Error(defaultMessage);
};

export const productService = {
  scanProductLocal: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/products/scan/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Error al conectar con la DB Local');
    }
  },

  scanProductOFF: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/open-food-facts/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Error al conectar con Open Food Facts');
    }
  },

  processOcrImage: async (imageUri: string, barcode?: string) => {
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'label.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      if (barcode) {
        formData.append('barcode', barcode.trim());
      }

      // NO configurar Content-Type manual para que Axios calcule el boundary automáticamente
      const response = await api.post('/ocr/process', formData);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Error al procesar la imagen con el servidor OCR');
    }
  },

  createLocalProduct: async (productData: FormData | any) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Error al guardar el producto en la base de datos');
    }
  },

  updateProductImage: async (barcode: string, formData: FormData) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.patch(`/products/${cleanBarcode}`, formData);
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Error al actualizar la imagen del producto');
    }
  },
};

export default api;
