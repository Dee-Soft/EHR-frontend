import * as z from 'zod';

/**
 * Zod schema for user login validation.
 * Validates email format and password strength requirements.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[a-z]/, 'Must include lowercase letter')
    .regex(/[0-9]/, 'Must include number')
    .regex(/[^A-Za-z0-9]/, 'Must include special character'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Zod schema for user registration validation.
 * Validates required fields and password strength requirements.
 * Matches backend registration endpoint expectations.
 */
export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[a-z]/, 'Must include lowercase letter')
    .regex(/[0-9]/, 'Must include number')
    .regex(/[^A-Za-z0-9]/, 'Must include special character'),
  role: z.enum(['Admin', 'Manager', 'Provider', 'Employee', 'Patient'], {
    required_error: 'Role is required',
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  employeeId: z.string().optional(),
  providerId: z.string().optional(),
  assignedProviderId: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

