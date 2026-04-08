'use client';
import { useState, useCallback } from 'react';
import { BusinessInfoInput } from '../models/register.model';
import { businessService } from '../services/business.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useBusinessMatch(merchantId: string, lang: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<BusinessInfoInput>({
    business_name: '',
    business_address: '',
    has_physical_address: true,
  });

  const handleChange = useCallback((field: keyof BusinessInfoInput, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const isValid = !!(values.business_name && (values.has_physical_address ? values.business_address : true));

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!values.business_name) {
      setError('Business name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await businessService.saveBusinessMatch(merchantId, values);
      if (response.success) {
        toast.success(response.message);
        // Next step is the MCC selection
        setTimeout(() => {
          router.push(`/${merchantId}/${lang}/business-mcc-selection`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save business info');
    } finally {
      setLoading(false);
    }
  }, [values, merchantId, lang, router]);

  return {
    values,
    loading,
    error,
    isValid,
    handleChange,
    handleSubmit,
  };
}
