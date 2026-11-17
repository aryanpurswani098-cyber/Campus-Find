import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('cf_token', token);
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem('cf_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  initialize: () => {
    const token = localStorage.getItem('cf_token');
    // Actual user fetch happens in App via react-query, but we can set token auth here.
    if (token) {
      set({ token, isAuthenticated: true });
    }
  }
}));
