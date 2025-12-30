import api from '@/lib/api';
import { User } from '@/types/user';

/**
 * Authentication service for handling login, logout, and user session management.
 */
export const authService = {
  /**
   * Login user with email and password.
   * @param email - User email
   * @param password - User password
   * @returns Promise with login response
   */
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Get current authenticated user.
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data?.user || response.data;
  },

  /**
   * Logout current user.
   * @returns Promise with logout response
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Test API connection.
   * @returns Promise with health check response
   */
  async testConnection() {
    const response = await api.get('/health');
    return response.data;
  },
};
