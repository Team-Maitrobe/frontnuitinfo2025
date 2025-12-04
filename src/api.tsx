/**
 * API Service Module
 * Provides typed API calls for the FormFilled endpoints
 * All requests are fully typed with TypeScript
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.156.3:8000';

/**
 * FormFilled Types
 */
export interface FormFilledCreate {
  user_type: string;
  user_name: string;
  user_city: string;
  user_country: string;
  school_type?: string | null;
  user_msg?: string | null;
}

export interface FormFilledUpdate {
  user_type?: string;
  user_name?: string;
  user_city?: string;
  user_country?: string;
  school_type?: string | null;
  user_msg?: string | null;
}

export interface FormFilledResponse extends FormFilledCreate {
  id: string; // UUID
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

/**
 * API Error Handler
 */
class APIError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(`API Error ${status}: ${detail}`);
  }
}

/**
 * Fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new APIError(response.status, error.detail || 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Form API Service
 */
export const formAPI = {
  /**
   * Create a new form entry
   * @param data Form data to create
   * @returns Created form with ID and timestamps
   */
  async create(data: FormFilledCreate): Promise<FormFilledResponse> {
    return apiFetch<FormFilledResponse>('/form/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a specific form by ID
   * @param formId UUID of the form
   * @returns Form data
   */
  async getById(formId: string): Promise<FormFilledResponse> {
    return apiFetch<FormFilledResponse>(`/form/${formId}`);
  },

  /**
   * Get all forms
   * @returns Array of all forms
   */
  async getAll(): Promise<FormFilledResponse[]> {
    return apiFetch<FormFilledResponse[]>('/form/');
  },

  /**
   * Update a form
   * @param formId UUID of the form
   * @param data Partial form data to update
   * @returns Updated form
   */
  async update(
    formId: string,
    data: FormFilledUpdate
  ): Promise<FormFilledResponse> {
    return apiFetch<FormFilledResponse>(`/form/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a form
   * @param formId UUID of the form
   */
  async delete(formId: string): Promise<void> {
    return apiFetch<void>(`/form/${formId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * System API Service
 */
export const systemAPI = {
  /**
   * Health check endpoint
   * @returns Health status including database connectivity
   */
  async health(): Promise<{ healthy: boolean; db: string }> {
    return apiFetch('/health');
  },

  /**
   * Get server status
   * @returns Server status
   */
  async status(): Promise<{ status: string }> {
    return apiFetch('/');
  },
};

export default { formAPI, systemAPI };