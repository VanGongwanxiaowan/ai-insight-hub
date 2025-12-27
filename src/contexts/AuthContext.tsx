/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, tokenManager, ApiRequestError } from '@/lib/api';
import type { User, UserLoginRequest, UserRegisterRequest, AuthContextValue } from '@/lib/api/types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Query current user
  const {
    data: user,
    error,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => apiService.auth.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isInitialized,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Login
  const login = useCallback(async (credentials: UserLoginRequest): Promise<void> => {
    const response = await apiService.auth.login(credentials);

    // Store tokens
    tokenManager.setTokens(response.access_token, response.refresh_token);

    // Set user for quick access
    const userData = await apiService.auth.getCurrentUser();
    tokenManager.setUser(JSON.stringify(userData));

    // Invalidate and refetch user query
    queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
  }, [queryClient]);

  // Register
  const register = useCallback(async (data: UserRegisterRequest): Promise<void> => {
    const response = await apiService.auth.register(data);

    // Store tokens
    tokenManager.setTokens(response.access_token, response.refresh_token);

    // Set user for quick access
    const userData = await apiService.auth.getCurrentUser();
    tokenManager.setUser(JSON.stringify(userData));

    // Invalidate and refetch user query
    queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
  }, [queryClient]);

  // Logout
  const logout = useCallback((): void => {
    // Clear all tokens
    tokenManager.clearTokens();

    // Clear all queries
    queryClient.clear();

    // Reset user state
    queryClient.resetQueries({ queryKey: ['auth', 'user'] });
  }, [queryClient]);

  // Refresh tokens
  const refreshTokens = useCallback(async (): Promise<void> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.auth.refreshToken(refreshToken);

    // Update stored tokens
    tokenManager.setTokens(
      response.access_token,
      refreshToken // Keep same refresh token
    );
  }, []);

  // Computed values
  const isAuthenticated = !!user && !error;
  const accessToken = tokenManager.getAccessToken();
  const refreshToken = tokenManager.getRefreshToken();

  const value: AuthContextValue = {
    user: user ?? null,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    login,
    register,
    logout,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(): AuthContextValue & { isAuthorized: boolean } {
  const auth = useAuth();
  const isAuthorized = auth.isAuthenticated && !auth.isLoading;

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return { ...auth, isAuthorized };
}
