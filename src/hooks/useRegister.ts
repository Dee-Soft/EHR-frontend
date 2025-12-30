import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/lib/services/adminService';
import { managerService } from '@/lib/services/managerService';
import { employeeService } from '@/lib/services/employeeService';
import { RegisterPayload } from '@/types/auth';
import { getErrorMessage } from '@/types/error';

/**
 * Custom hook for user registration functionality.
 * Handles API calls to register new users with the backend using RBAC.
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Get the appropriate registration service based on current user's role.
   * @param targetRole - The role being registered
   * @returns The appropriate service function
   */
  const getRegistrationService = (targetRole: RegisterPayload['role']) => {
    if (!user) {
      throw new Error('Authentication required for registration');
    }

    const currentRole = user.role;
    
    // Check RBAC permissions based on backend documentation
    switch (currentRole) {
      case 'Admin':
        // Admin can register any role
        return adminService.registerUser;
      
      case 'Manager':
        // Manager can register Patient, Employee, Provider
        if (['Patient', 'Employee', 'Provider'].includes(targetRole)) {
          if (targetRole === 'Employee') {
            return managerService.registerEmployee;
          } else if (targetRole === 'Provider') {
            return managerService.registerProvider;
          } else {
            return managerService.registerUser;
          }
        }
        break;
      
      case 'Employee':
        // Employee can only register Patient
        if (targetRole === 'Patient') {
          return employeeService.registerPatient;
        }
        break;
      
      case 'Provider':
      case 'Patient':
        // Provider and Patient cannot register anyone
        break;
    }
    
    throw new Error(`You do not have permission to register a ${targetRole} role.`);
  };

  /**
   * Register a new user with the provided payload.
   * @param payload - User registration data including name, email, password, and role
   */
  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      // Get the appropriate registration service based on RBAC
      const registerFunction = getRegistrationService(payload.role);
      
      // Call the registration function
      const response = await registerFunction(payload);
      
      if (response?.success) {
        // Registration successful
        console.log('Registration successful:', response);
        return response;
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      // Provide user-friendly error messages
      if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || 
          errorMessage.includes('permission')) {
        setError('You do not have permission to register this role.');
      } else if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
        setError('A user with this email already exists.');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('Authentication required. Please login again.');
      } else {
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}