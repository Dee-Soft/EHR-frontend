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
 */
export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[a-z]/, 'Must include lowercase letter')
    .regex(/[0-9]/, 'Must include number')
    .regex(/[^A-Za-z0-9]/, 'Must include special character'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

