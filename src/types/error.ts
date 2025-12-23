/**
 * API error response interface.
 * Represents standard error responses from the backend API.
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

/**
 * Extended error interface for API errors with Axios response.
 */
export interface ApiError extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
  encryptionError?: boolean;
  openBaoError?: boolean;
}

/**
 * Type guard to check if an error is an API error.
 * @param error - Error to check
 * @returns True if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiError).response === 'object'
  );
}

/**
 * Extract error message from unknown error.
 * @param error - Error to extract message from
 * @returns Human-readable error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || 'An unknown error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return typeof error === 'string' ? error : 'An unknown error occurred';
}
