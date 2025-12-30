/**
 * User interface representing a user in the EHR system.
 * Contains basic user information and role-based permissions.
 * Matches backend User model structure.
 */
export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Provider' | 'Employee' | 'Patient';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  employeeId?: string;
  providerId?: string;
  assignedProviderId?: string;
  assignedPatients?: string[];
  createdAt?: string;
  updatedAt?: string;
}