'use client';
import { useState, useCallback } from 'react';
import { businessService } from '../services/business.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AnnualRevenueOption } from '../models/register.model';

export const REVENUE_OPTIONS: AnnualRevenueOption[] = [
  { id: 'less-100k', label: 'Less than $100K' },
  { id: '100k-250k', label: '$100K - $250K' },
  { id: '250k-1m', label: '$250K - $1M' },
  { id: '1m-5m', label: '$1M - $5M' },
  { id: '5m-25m', label: '$5M - $25M+' },
  { id: 'not-sure', label: 'Not sure yet', subtext: "If you're a new business, or don't know right now" },
];

export function useAnnualRevenue(merchantId: string, lang: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (revenueId?: string) => {
    const idToSave = revenueId || selectedId;
    if (!idToSave) return;

    setLoading(true);
    setError(null);

    try {
      const response = await businessService.saveAnnualRevenue(merchantId, {
        revenue_id: idToSave,
      });
      if (response.success) {
        toast.success(response.message);
        // Onboarding potentially complete or next step
        // Currently, redirecting to products as per BusinessMccForm's previous logic
        setTimeout(() => {
          router.push(`/${merchantId}/${lang}/products`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save annual revenue');
    } finally {
      setLoading(false);
    }
  }, [selectedId, merchantId, lang, router]);

  return {
    selectedId,
    setSelectedId,
    loading,
    error,
    handleSubmit,
  };
}
