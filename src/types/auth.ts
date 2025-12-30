/**
 * Payload interface for user registration requests.
 * Contains all required fields for creating a new user account.
 * Matches backend registration endpoint expectations.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Provider' | 'Employee' | 'Patient';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  employeeId?: string;
  providerId?: string;
  assignedProviderId?: string;
}