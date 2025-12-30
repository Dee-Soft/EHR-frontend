import api from '@/lib/api';
import { User } from '@/types/user';
import { RegisterPayload } from '@/types/auth';

/**
 * Manager service for handling manager-specific operations.
 * Accessible to users with Manager or Admin roles.
 */
export const managerService = {
  /**
   * Register a new user (Manager can register Patient, Employee, Provider).
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async registerUser(userData: RegisterPayload) {
    const response = await api.post('/managers/register', userData);
    return response.data;
  },

  /**
   * Register a new employee (Manager only).
   * @param employeeData - Employee registration data
   * @returns Promise with registration response
   */
  async registerEmployee(employeeData: Omit<RegisterPayload, 'role'> & { role: 'Employee' }) {
    const response = await api.post('/managers/register/employee', employeeData);
    return response.data;
  },

  /**
   * Register a new provider (Manager only).
   * @param providerData - Provider registration data
   * @returns Promise with registration response
   */
  async registerProvider(providerData: Omit<RegisterPayload, 'role'> & { role: 'Provider' }) {
    const response = await api.post('/managers/register/provider', providerData);
    return response.data;
  },

  /**
   * Get all employees (Manager only).
   * @returns Promise with list of employees
   */
  async getAllEmployees(): Promise<User[]> {
    const response = await api.get('/managers/employees');
    return response.data?.employees || response.data || [];
  },

  /**
   * Update employee by ID (Manager only).
   * @param employeeId - Employee ID
   * @param updateData - Employee update data
   * @returns Promise with update response
   */
  async updateEmployee(employeeId: string, updateData: Partial<User>) {
    const response = await api.put(`/managers/employees/${employeeId}`, updateData);
    return response.data;
  },

  /**
   * Get system statistics (Manager only).
   * @returns Promise with system statistics
   */
  async getSystemStats() {
    const response = await api.get('/managers/system-stats');
    return response.data?.stats || response.data || {};
  },
};
