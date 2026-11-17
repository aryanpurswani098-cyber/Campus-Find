import apiClient from './client';
import { Match } from '../types';

export const matchesApi = {
  getMyMatches: async (status?: string): Promise<Match[]> => {
    const { data } = await apiClient.get<Match[]>('/matches', { params: { status } });
    return data;
  },
  getItemMatches: async (itemId: string): Promise<Match[]> => {
    const { data } = await apiClient.get<Match[]>(`/matches/item/${itemId}`);
    return data;
  },
  dismissMatch: async (id: string): Promise<void> => {
    await apiClient.patch(`/matches/${id}/dismiss`);
  },
  confirmMatch: async (id: string): Promise<void> => {
    await apiClient.patch(`/matches/${id}/confirm`);
  }
};
