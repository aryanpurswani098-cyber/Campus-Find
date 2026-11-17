import apiClient from './client';
import { Claim } from '../types';

export const claimsApi = {
  submitClaim: async (claimData: any): Promise<Claim> => {
    const { data } = await apiClient.post<Claim>('/claims', claimData);
    return data;
  },
  getMyClaims: async (): Promise<Claim[]> => {
    const { data } = await apiClient.get<Claim[]>('/claims/my');
    return data;
  },
  getAllClaims: async (status?: string): Promise<Claim[]> => {
    const { data } = await apiClient.get<Claim[]>('/claims', { params: { status } });
    return data;
  },
  reviewClaim: async (id: string, reviewData: { status: string; admin_notes?: string }): Promise<Claim> => {
    const { data } = await apiClient.patch<Claim>(`/claims/${id}/review`, reviewData);
    return data;
  }
};
