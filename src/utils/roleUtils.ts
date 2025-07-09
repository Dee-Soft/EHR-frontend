export const canRegister: Record<string, string[]> = {
  Patient: ['Employee', 'Manager', 'Admin'],
  Provider: ['Manager', 'Admin'],
  Employee: ['Manager', 'Admin'],
  Manager: ['Admin'],
};

export function getAllowedRegistrations(role: string): string[] {
  return Object.entries(canRegister)
    .filter(([_, allowedRoles]) => allowedRoles.includes(role))
    .map(([targetRole]) => targetRole);
}