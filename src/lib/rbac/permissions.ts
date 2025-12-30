import { User } from '@/types/user';

/**
 * RBAC permission checker for the EHR system.
 * Based on backend API documentation permission matrices.
 */

export type UserRole = 'Admin' | 'Manager' | 'Employee' | 'Provider' | 'Patient';

/**
 * Check if a user can register another user with a specific role.
 * Based on backend documentation: User Registration Permissions matrix.
 */
export function canRegisterRole(currentUserRole: UserRole, targetRole: UserRole): boolean {
  const permissionMatrix: Record<UserRole, UserRole[]> = {
    Admin: ['Admin', 'Manager', 'Employee', 'Provider', 'Patient'],
    Manager: ['Employee', 'Provider', 'Patient'],
    Employee: ['Patient'],
    Provider: [], // Providers cannot register anyone
    Patient: [], // Patients cannot register anyone
  };

  return permissionMatrix[currentUserRole]?.includes(targetRole) || false;
}

/**
 * Check if a user can update another user based on roles.
 * Based on backend documentation: User Update Permissions matrix.
 */
export function canUpdateUser(currentUser: User, targetUser: User): boolean {
  const currentRole = currentUser.role;
  const targetRole = targetUser.role;

  // Users can always update their own profile (with field restrictions)
  if (currentUser.id === targetUser.id) {
    return true;
  }

  // Permission matrix for updating other users
  const updatePermissions: Record<UserRole, UserRole[]> = {
    Admin: ['Admin', 'Manager', 'Employee', 'Provider', 'Patient'],
    Manager: ['Employee', 'Provider', 'Patient'],
    Employee: ['Patient'],
    Provider: [], // Providers cannot update other users
    Patient: [], // Patients cannot update other users
  };

  return updatePermissions[currentRole]?.includes(targetRole) || false;
}

/**
 * Get which fields a user can update on another user.
 * Based on backend documentation: Field-Level Update Permissions.
 */
export function getUpdatableFields(currentUser: User, targetUser: User): string[] {
  const currentRole = currentUser.role;
  const targetRole = targetUser.role;
  const isSelf = currentUser.id === targetUser.id;

  // Field permissions based on role combinations
  const fieldPermissions: Record<string, string[]> = {
    // Admin can update all fields on anyone
    'Admin-any': ['name', 'email', 'password', 'phone', 'address', 'dateOfBirth', 'gender', 'employeeId', 'providerId', 'assignedProviderId', 'role'],
    
    // Admin updating self
    'Admin-self': ['name', 'email', 'password', 'phone', 'address', 'dateOfBirth', 'gender', 'employeeId', 'providerId', 'assignedProviderId', 'role'],
    
    // Manager updating Patient
    'Manager-Patient': ['name', 'email', 'phone', 'address', 'dateOfBirth', 'gender', 'assignedProviderId'],
    
    // Manager updating Employee
    'Manager-Employee': ['name', 'email', 'phone', 'address', 'employeeId'],
    
    // Manager updating Provider
    'Manager-Provider': ['name', 'email', 'phone', 'address', 'providerId', 'assignedPatients'],
    
    // Manager updating self
    'Manager-self': ['name', 'email', 'password', 'phone', 'address', 'dateOfBirth', 'gender', 'employeeId', 'providerId', 'assignedProviderId'],
    
    // Employee updating Patient
    'Employee-Patient': ['name', 'email', 'phone', 'address', 'dateOfBirth', 'gender', 'assignedProviderId'],
    
    // Employee updating self
    'Employee-self': ['name', 'email', 'password', 'phone', 'address', 'dateOfBirth', 'gender', 'employeeId', 'providerId', 'assignedProviderId'],
    
    // Provider updating self
    'Provider-self': ['name', 'email', 'password', 'phone', 'address', 'dateOfBirth', 'gender', 'providerId', 'assignedPatients'],
    
    // Patient updating self (limited fields)
    'Patient-self': ['phone', 'address'],
  };

  // Determine the permission key
  let permissionKey = '';
  
  if (currentRole === 'Admin' && !isSelf) {
    permissionKey = 'Admin-any';
  } else if (isSelf) {
    permissionKey = `${currentRole}-self`;
  } else {
    permissionKey = `${currentRole}-${targetRole}`;
  }

  return fieldPermissions[permissionKey] || [];
}

/**
 * Check if a user can create patient records.
 * Based on backend documentation: Only Providers can create records for assigned patients.
 */
export function canCreatePatientRecord(user: User): boolean {
  return user.role === 'Provider' || user.role === 'Admin';
}

/**
 * Check if a user can view a specific patient record.
 * Based on backend documentation: Patient Record Access Permissions.
 */
export function canViewPatientRecord(user: User, recordPatientId: string, isAssignedProvider = false): boolean {
  const userRole = user.role;
  
  // Patients can only view their own records
  if (userRole === 'Patient') {
    return user.id === recordPatientId;
  }
  
  // Providers can view records of assigned patients
  if (userRole === 'Provider') {
    return isAssignedProvider;
  }
  
  // Admin can view all records
  if (userRole === 'Admin') {
    return true;
  }
  
  // Managers and Employees cannot view patient records directly
  return false;
}

/**
 * Check if a user can access admin features.
 */
export function canAccessAdminFeatures(user: User): boolean {
  return user.role === 'Admin';
}

/**
 * Check if a user can access manager features.
 */
export function canAccessManagerFeatures(user: User): boolean {
  return user.role === 'Manager' || user.role === 'Admin';
}

/**
 * Check if a user can access employee features.
 */
export function canAccessEmployeeFeatures(user: User): boolean {
  return user.role === 'Employee' || user.role === 'Manager' || user.role === 'Admin';
}

/**
 * Check if a user can access provider features.
 */
export function canAccessProviderFeatures(user: User): boolean {
  return user.role === 'Provider' || user.role === 'Admin';
}

/**
 * Check if a user can access patient features.
 */
export function canAccessPatientFeatures(user: User): boolean {
  return user.role === 'Patient' || user.role === 'Admin';
}

/**
 * Get available registration roles for the current user.
 * Useful for showing role options in registration forms.
 */
export function getAvailableRegistrationRoles(currentUserRole: UserRole): UserRole[] {
  const availableRoles: Record<UserRole, UserRole[]> = {
    Admin: ['Admin', 'Manager', 'Employee', 'Provider', 'Patient'],
    Manager: ['Employee', 'Provider', 'Patient'],
    Employee: ['Patient'],
    Provider: [],
    Patient: [],
  };

  return availableRoles[currentUserRole] || [];
}
