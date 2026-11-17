import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { useMutation } from '@tanstack/react-query';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = useMutation({
    mutationFn: (credentials: any) => authApi.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
    }
  });

  const register = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
    }
  });

  const logout = () => {
    clearAuth();
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  };
};
