import apiClient from './client';
import { AdminStats, Item, User } from '../types';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get<AdminStats>('/admin/stats');
    return data;
  },
  getAdminItems: async (params?: any): Promise<Item[]> => {
    const { data } = await apiClient.get<Item[]>('/admin/items', { params });
    return data;
  },
  verifyItem: async (id: string, data: { verification: string; notes?: string }): Promise<void> => {
    await apiClient.patch(`/admin/items/${id}/verify`, data);
  },
  adminDeleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/items/${id}`);
  },
  getAdminUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/admin/users');
    return data;
  },
  getAnalytics: async (): Promise<{ top_categories: any[]; status_breakdown: any[] }> => {
    const { data } = await apiClient.get('/admin/analytics');
    return data;
  }
};
