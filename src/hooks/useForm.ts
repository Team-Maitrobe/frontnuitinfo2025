/**
 * Custom React Hooks for API calls
 * Simplifies data fetching and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { formAPI } from '../api';
import type { FormFilledResponse, FormFilledCreate, FormFilledUpdate } from '../api';


/**
 * Hook to fetch all forms
 * @returns { data: forms, loading, error, refetch }
 */
export function useFormsFetch() {
  const [data, setData] = useState<FormFilledResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const forms = await formAPI.getAll();
      setData(forms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook to fetch a single form by ID
 * @param formId - UUID of the form
 * @returns { data: form, loading, error, refetch }
 */
export function useFormById(formId: string) {
  const [data, setData] = useState<FormFilledResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const form = await formAPI.getById(formId);
      setData(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form');
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    if (formId) {
      refetch();
    }
  }, [formId, refetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook to create a form
 * @returns { createForm, loading, error, success }
 */
export function useFormCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createForm = useCallback(async (formData: FormFilledCreate) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const result = await formAPI.create(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create form';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createForm, loading, error, success };
}

/**
 * Hook to update a form
 * @returns { updateForm, loading, error, success }
 */
export function useFormUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateForm = useCallback(
    async (formId: string, formData: FormFilledUpdate) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        const result = await formAPI.update(formId, formData);
        setSuccess(true);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update form';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateForm, loading, error, success };
}

/**
 * Hook to delete a form
 * @returns { deleteForm, loading, error, success }
 */
export function useFormDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteForm = useCallback(async (formId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await formAPI.delete(formId);
      setSuccess(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete form';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteForm, loading, error, success };
}
