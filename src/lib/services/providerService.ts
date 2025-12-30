import api from '@/lib/api';
import { User } from '@/types/user';

interface Schedule {
  days?: string[];
  hours?: {
    start: string;
    end: string;
  };
  timezone?: string;
}

/**
 * Provider service for handling provider-specific operations.
 * Accessible to users with Provider or Admin roles.
 */
export const providerService = {
  /**
   * Get provider profile.
   * @returns Promise with provider profile data
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/providers/profile');
    return response.data?.provider || response.data;
  },

  /**
   * Update provider availability.
   * @param availability - Availability data
   * @returns Promise with update response
   */
  async updateAvailability(availability: { available: boolean; schedule?: Schedule }) {
    const response = await api.put('/providers/availability', availability);
    return response.data;
  },

  /**
   * Get assigned patients.
   * @returns Promise with list of assigned patients
   */
  async getAssignedPatients(): Promise<User[]> {
    const response = await api.get('/providers/assigned-patients');
    return response.data?.patients || response.data || [];
  },

  /**
   * Create patient record.
   * @param recordData - Patient record data
   * @returns Promise with created record
   */
  async createPatientRecord(recordData: {
    patientId: string;
    recordType: string;
    diagnosis?: string;
    treatment?: string;
    medications?: string[];
    notes?: string;
    vitalSigns?: {
      temperature?: number;
      bloodPressure?: string;
      heartRate?: number;
    };
  }) {
    const response = await api.post('/providers/patient-records', recordData);
    return response.data?.record || response.data;
  },

  /**
   * Get patient records for assigned patients.
   * @returns Promise with list of patient records
   */
  async getPatientRecords() {
    const response = await api.get('/providers/patient-records');
    return response.data?.records || response.data || [];
  },
};
