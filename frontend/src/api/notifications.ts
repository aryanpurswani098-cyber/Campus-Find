import apiClient from './client';
import { Notification } from '../types';

export const notificationsApi = {
  getNotifications: async (params?: any): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>('/notifications', { params });
    return data;
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return data;
  },
  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },
  markAllRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  }
};
