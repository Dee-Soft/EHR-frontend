/**
 * User interface representing a user in the EHR system.
 * Contains basic user information and role-based permissions.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Provider' | 'Employee' | 'Patient';
}