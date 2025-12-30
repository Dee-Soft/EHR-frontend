import { authService } from './authService';
import { checkOpenBaoHealth } from '../openbao/utils';

/**
 * Safely extract error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * Test service for verifying system integration.
 */
export const testService = {
  /**
   * Test backend API connection.
   */
  async testBackendConnection(): Promise<{
    success: boolean;
    message: string;
    details?: unknown;
  }> {
    try {
      const response = await authService.testConnection();
      return {
        success: true,
        message: 'Backend API is reachable',
        details: response,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `Backend API connection failed: ${getErrorMessage(error)}`,
        details: error,
      };
    }
  },

  /**
   * Test OpenBao connection and key configuration.
   */
  async testOpenBaoConnection(): Promise<{
    success: boolean;
    message: string;
    details?: unknown;
  }> {
    try {
      const health = await checkOpenBaoHealth();
      return {
        success: health.healthy,
        message: health.healthy 
          ? 'OpenBao is properly configured' 
          : `OpenBao missing keys: ${health.missingKeys.join(', ')}`,
        details: health,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `OpenBao connection failed: ${getErrorMessage(error)}`,
        details: error,
      };
    }
  },

  /**
   * Test authentication flow with test credentials.
   * Note: This should only be used in development.
   */
  async testAuthentication(): Promise<{
    success: boolean;
    message: string;
    details?: unknown;
  }> {
    try {
      // Try to get current user (requires valid session)
      const user = await authService.getCurrentUser();
      return {
        success: true,
        message: `Authenticated as ${user.email} (${user.role})`,
        details: { user: { id: user.id, email: user.email, role: user.role } },
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: 'Not authenticated or session expired',
        details: error,
      };
    }
  },

  /**
   * Run all system tests.
   */
  async runAllTests(): Promise<{
    backend: { success: boolean; message: string };
    openbao: { success: boolean; message: string };
    auth: { success: boolean; message: string };
    allPassed: boolean;
  }> {
    const [backendResult, openbaoResult, authResult] = await Promise.all([
      this.testBackendConnection(),
      this.testOpenBaoConnection(),
      this.testAuthentication(),
    ]);

    return {
      backend: backendResult,
      openbao: openbaoResult,
      auth: authResult,
      allPassed: backendResult.success && openbaoResult.success && authResult.success,
    };
  },
};
