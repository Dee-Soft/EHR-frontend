import api from '@/lib/api';
import { User } from '@/types/user';
import { RegisterPayload } from '@/types/auth';

/**
 * Admin service for handling admin-specific operations.
 * Only accessible to users with Admin role.
 */
export const adminService = {
  /**
   * Register a new user with any role (Admin only).
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async registerUser(userData: RegisterPayload) {
    const response = await api.post('/admin/register', userData);
    return response.data;
  },

  /**
   * Get all users in the system (Admin only).
   * @returns Promise with list of users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data?.users || response.data || [];
  },

  /**
   * Get user by ID (Admin only).
   * @param userId - User ID
   * @returns Promise with user data
   */
  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data?.user || response.data;
  },

  /**
   * Delete user by ID (Admin only).
   * @param userId - User ID
   * @returns Promise with deletion response
   */
  async deleteUser(userId: string) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Get audit logs (Admin only).
   * @returns Promise with audit logs
   */
  async getAuditLogs() {
    const response = await api.get('/admin/audit-logs');
    return response.data?.logs || response.data || [];
  },

  /**
   * Bulk register users (Admin only).
   * @param usersData - Array of user registration data
   * @returns Promise with bulk registration response
   */
  async bulkRegisterUsers(usersData: RegisterPayload[]) {
    const response = await api.post('/admin/register/bulk', { users: usersData });
    return response.data;
  },
};
