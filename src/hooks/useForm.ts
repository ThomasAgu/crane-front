// src/hooks/useForm.ts
import { useState } from 'react';

export function useForm<T extends Record<string, unknown>>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [inputValidity, setInputValidity] = useState<Record<keyof T, boolean>>(
    Object.keys(initialData).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<keyof T, boolean>)
  );
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const updateField = (key: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [key]: value }));
    setApiError('');
  };

  const updateValidity = (key: keyof T, isValid: boolean) => {
    setInputValidity(prev => ({ ...prev, [key]: isValid }));
  };

  const isFormValid = Object.values(inputValidity).every(Boolean);

  return {
    data,
    updateField,
    inputValidity,
    updateValidity,
    showErrors,
    setShowErrors,
    loading,
    setLoading,
    apiError,
    setApiError,
    isFormValid
  };
}