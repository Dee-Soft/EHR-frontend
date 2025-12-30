import api from '@/lib/api';
import { User } from '@/types/user';
import { RegisterPayload } from '@/types/auth';

/**
 * Employee service for handling employee-specific operations.
 * Accessible to users with Employee, Manager, or Admin roles.
 */
export const employeeService = {
  /**
   * Register a new patient (Employee only).
   * @param patientData - Patient registration data
   * @returns Promise with registration response
   */
  async registerPatient(patientData: Omit<RegisterPayload, 'role'> & { role: 'Patient' }) {
    const response = await api.post('/employees/register/patient', patientData);
    return response.data;
  },

  /**
   * Bulk register patients (Employee only).
   * @param patientsData - Array of patient registration data
   * @returns Promise with bulk registration response
   */
  async bulkRegisterPatients(patientsData: Array<Omit<RegisterPayload, 'role'> & { role: 'Patient' }>) {
    const response = await api.post('/employees/register/patients/bulk', { patients: patientsData });
    return response.data;
  },

  /**
   * Get all providers (Employee only).
   * @returns Promise with list of providers
   */
  async getAllProviders(): Promise<User[]> {
    const response = await api.get('/employees/providers');
    return response.data?.providers || response.data || [];
  },

  /**
   * Get all patients (Employee only).
   * @returns Promise with list of patients
   */
  async getAllPatients(): Promise<User[]> {
    const response = await api.get('/employees/patients');
    return response.data?.patients || response.data || [];
  },

  /**
   * Assign patient to provider (Employee only).
   * @param patientId - Patient ID
   * @param providerId - Provider ID
   * @returns Promise with assignment response
   */
  async assignPatientToProvider(patientId: string, providerId: string) {
    const response = await api.post('/employees/assignments', { patientId, providerId });
    return response.data;
  },
};
