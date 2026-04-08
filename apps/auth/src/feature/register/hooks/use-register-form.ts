'use client';
import { useState, useCallback } from 'react';
import { RegisterInput, RegisterResponse } from '../models/register.model';
import { registerService } from '../services/register.service';
import { ApiResponse } from '@/core/api/api.types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useRegisterForm(lang: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<RegisterInput>({
    merchant_name: '',
    email: '',
    password: '',
    locale: 'US', // Default to US
    agree: false,
  });

  const handleChange = useCallback((field: keyof RegisterInput, value: any) => {
    let finalValue = value;

    // Auto-format merchant_name to lowercase, numbers, and hyphens only
    if (field === 'merchant_name' && typeof value === 'string') {
      finalValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric (except hyphen) with hyphen
        .replace(/-+/g, '-');        // Collapse multiple hyphens
    }

    setValues(prev => ({ ...prev, [field]: finalValue }));
    if (error) setError(null);
  }, [error]);

  const isValid = !!(values.merchant_name && values.email && values.password && values.agree);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Basic validation
    if (!values.merchant_name || !values.email || !values.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!values.agree) {
      setError('You must agree to the terms');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerService.register(values);
      if (response.success) {
        toast.success(response.message);
        // Redirect to business-match
        setTimeout(() => {
          const merchantPath = response.data?.merchant_id || values.merchant_name;
          router.push(`/${merchantPath}/${lang}/business-match`);
        }, 1500);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  }, [values, lang, router]);

  return {
    values,
    loading,
    error,
    isValid,
    handleChange,
    handleSubmit,
  };
}
