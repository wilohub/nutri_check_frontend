import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Incrementado para carga de imágenes
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  scanProductLocal: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/products/scan/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error('Error al conectar con la DB Local');
    }
  },

  scanProductOFF: async (barcode: string) => {
    try {
      const cleanBarcode = barcode.trim();
      const response = await api.get(`/open-food-facts/${cleanBarcode}`);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error('Error al conectar con Open Food Facts');
    }
  },

  // Subir imagen capturada al OCR
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

      const response = await api.post('/ocr/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error('Error al procesar la imagen con el servidor OCR');
    }
  },

  // Persistir producto confirmado en DB Local
  createLocalProduct: async (productData: any) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error: any) {
      if (error.response) throw error.response.data;
      throw new Error('Error al guardar el producto en la base de datos');
    }
  },
};

export default api;
