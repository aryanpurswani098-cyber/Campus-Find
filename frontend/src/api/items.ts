import apiClient from './client';
import { ItemListOut, Item, Category, Location } from '../types';

export const itemsApi = {
  getItems: async (params?: any): Promise<ItemListOut> => {
    const { data } = await apiClient.get<ItemListOut>('/items', { params });
    return data;
  },
  getItem: async (id: string): Promise<Item> => {
    const { data } = await apiClient.get<Item>(`/items/${id}`);
    return data;
  },
  createItem: async (itemData: any): Promise<Item> => {
    const { data } = await apiClient.post<Item>('/items', itemData);
    return data;
  },
  updateItem: async (id: string, itemData: any): Promise<Item> => {
    const { data } = await apiClient.put<Item>(`/items/${id}`, itemData);
    return data;
  },
  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },
  markRecovered: async (id: string): Promise<Item> => {
    const { data } = await apiClient.patch<Item>(`/items/${id}/recovered`);
    return data;
  },
  getMyItems: async (params?: any): Promise<Item[]> => {
    const { data } = await apiClient.get<Item[]>('/items/my', { params });
    return data;
  },
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/items/categories');
    return data;
  },
  getLocations: async (): Promise<Location[]> => {
    const { data } = await apiClient.get<Location[]>('/items/locations');
    return data;
  },
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<{ url: string }>('/items/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
