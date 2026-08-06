export type ParsedError = {
  readonly message: string;
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;
  readonly originalError: unknown;
};

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
}

function hasStatus(value: unknown): value is { status: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    typeof (value as Record<string, unknown>).status === 'number'
  );
}

function hasCode(value: unknown): value is { code: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as Record<string, unknown>).code === 'string'
  );
}

function hasResponse(value: unknown): value is { response: unknown } {
  return typeof value === 'object' && value !== null && 'response' in value;
}

function extractAxiosMessage(error: unknown): string | undefined {
  if (!hasResponse(error)) return undefined;
  const { response } = error;
  if (hasMessage(response)) return response.message;
  if (typeof response === 'object' && response !== null && 'data' in response) {
    const { data } = response as { data: unknown };
    if (hasMessage(data)) return data.message;
  }
  return undefined;
}

/**
 * Converts an unknown error value into a typed ParsedError object.
 *
 * Handles:
 * - `Error` instances
 * - Axios-like errors (with `.response.data.message`)
 * - Fetch Response errors (with `.status`)
 * - Objects with a `.message` string property
 * - Plain strings
 * - Anything else → generic fallback message
 *
 * @example
 * parseError(new Error('oops'))
 * // { message: 'oops', originalError: Error }
 *
 * parseError('ENOENT')
 * // { message: 'ENOENT', originalError: 'ENOENT' }
 */
export function parseError(error: unknown): ParsedError {
  const axiosMessage = extractAxiosMessage(error);
  const status = hasResponse(error)
    ? hasStatus((error as { response: unknown }).response)
      ? (error as { response: { status: number } }).response.status
      : undefined
    : hasStatus(error)
      ? error.status
      : undefined;
  const code = hasCode(error) ? error.code : undefined;
  const data = hasResponse(error) ? (error as { response: unknown }).response : undefined;

  if (axiosMessage) {
    return { message: axiosMessage, status, code, data, originalError: error };
  }
  if (error instanceof Error) {
    return { message: error.message, status, code, originalError: error };
  }
  if (hasMessage(error)) {
    return { message: error.message, status, code, originalError: error };
  }
  if (typeof error === 'string') {
    return { message: error, originalError: error };
  }
  return { message: 'An unknown error occurred', originalError: error };
}
