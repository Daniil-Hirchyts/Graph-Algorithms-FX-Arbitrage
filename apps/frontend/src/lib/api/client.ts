export class APIError extends Error {
  status?: number;
  detail?: unknown;
  
  constructor(
    message: string,
    status?: number,
    detail?: unknown
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.detail = detail;
  }
}

export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let detail: unknown = null;

      try {
        const errorData = await response.json();
        if (errorData.detail) {
          detail = errorData.detail;
          errorMessage = typeof detail === 'string' ? detail : errorMessage;
        }
      } catch {
        // Failed to parse error JSON, use status text
      }

      throw new APIError(errorMessage, response.status, detail);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

