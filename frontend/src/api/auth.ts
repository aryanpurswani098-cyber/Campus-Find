import apiClient from './client';
import { TokenResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/auth/login', { email, password });
    return data;
  },
  register: async (registerData: any): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/auth/register', registerData);
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
  }
};
