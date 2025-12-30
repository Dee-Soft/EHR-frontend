import api from '@/lib/api';
import { User } from '@/types/user';

/**
 * Patient service for handling patient-specific operations.
 * Accessible to users with Patient role.
 */
export const patientService = {
  /**
   * Get patient profile.
   * @returns Promise with patient profile data
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/patients/profile');
    return response.data?.patient || response.data;
  },

  /**
   * Update patient profile (limited fields: phone, address).
   * @param updateData - Profile update data
   * @returns Promise with update response
   */
  async updateProfile(updateData: { phone?: string; address?: string }) {
    const response = await api.put('/patients/profile', updateData);
    return response.data;
  },

  /**
   * Get patient's own health records.
   * @returns Promise with list of health records
   */
  async getMyRecords() {
    const response = await api.get('/patients/my-records');
    return response.data?.records || response.data || [];
  },

  /**
   * Get specific patient record by ID.
   * @param recordId - Record ID
   * @returns Promise with record data
   */
  async getRecordById(recordId: string) {
    const response = await api.get(`/patient-records/${recordId}`);
    return response.data?.record || response.data;
  },
};
