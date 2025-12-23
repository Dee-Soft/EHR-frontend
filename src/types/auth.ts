/**
 * Payload interface for user registration requests.
 * Contains all required fields for creating a new user account.
 */
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}