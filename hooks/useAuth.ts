// ============================================================
// UIKA Career Portal — Auth Hook
// ============================================================

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api/auth';
import type { LoginDto, RegisterDto } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        storeLogout();
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        storeLogout();
      } finally {
        setLoading(false);
      }
    };

    if (isLoading) {
      initAuth();
    }
  }, [isLoading, setUser, setLoading, storeLogout]);

  const login = async (dto: LoginDto) => {
    setLoading(true);
    try {
      const { user: userData, tokens } = await authApi.login(dto);
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      setUser(userData);
      
      if (userData.role?.toLowerCase() === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dasbor');
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setLoading(true);
    try {
      await authApi.register(dto);
      storeLogout();
      router.push('/login?registered=1');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    login,
    register,
    logout,
  };
}
