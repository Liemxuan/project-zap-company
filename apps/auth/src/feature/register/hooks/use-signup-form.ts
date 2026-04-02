'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SignupFormValues } from '../models/register.model';
import { signupAction } from '../services/register.service';

export function useSignupForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignupFormValues>({
    merchant_name: '',
    merchant_url: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    dialing_code: '+84',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof SignupFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!values.merchant_name.trim()) {
      setError('Merchant name is required');
      setLoading(false);
      return;
    }
    if (!values.merchant_url.trim()) {
      setError('Merchant URL is required');
      setLoading(false);
      return;
    }
    if (!values.first_name.trim()) {
      setError('First name is required');
      setLoading(false);
      return;
    }
    if (!values.last_name.trim()) {
      setError('Last name is required');
      setLoading(false);
      return;
    }
    if (!values.email.trim() || !values.email.includes('@')) {
      setError('Valid email is required');
      setLoading(false);
      return;
    }
    if (!values.password || values.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (!values.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      const result = await signupAction(values);
      if (result.success) {
        // Redirect to login page
        router.push('/login');
      } else {
        setError(result.error || 'Signup failed');
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return {
    values,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}
