'use client';
import { useState, useCallback, useMemo } from 'react';
import { businessService } from '../services/business.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { BusinessCategory } from '../models/register.model';

export const MOCK_CATEGORIES: BusinessCategory[] = [
  { id: 'food-truck', label: 'Food Truck/Cart', category: 'Food and Drink' },
  { id: 'clothing', label: 'Clothing and Accessories', category: 'Retail' },
  { id: 'specialty', label: 'Specialty Shop', category: 'Retail' },
  { id: 'counter-service', label: 'Counter Service Restaurant/Other', category: 'Food and Drink' },
  { id: 'events', label: 'Events/Festivals', category: 'Leisure and Entertainment' },
  { id: 'outdoor-markets', label: 'Outdoor Markets', category: 'Retail' },
  { id: 'bakery', label: 'Bakery', category: 'Food and Drink' },
  { id: 'bar-club', label: 'Bar/Club', category: 'Food and Drink' },
  { id: 'beauty-salon', label: 'Beauty Salon', category: 'Health and Beauty' },
  { id: 'charity', label: 'Charity/Social Organization', category: 'Organizations' },
];

export function useBusinessMcc(merchantId: string, lang: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return MOCK_CATEGORIES;
    const lowerQuery = searchQuery.toLowerCase();
    return MOCK_CATEGORIES.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) || 
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleSubmit = useCallback(async () => {
    if (!selectedId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await businessService.saveBusinessMcc(merchantId, {
        category_id: selectedId,
        business_name: businessName,
        phone_number: phoneNumber,
      });
      if (response.success) {
        toast.success(response.message);
        // Next step: Annual Revenue selection
        setTimeout(() => {
          router.push(`/${merchantId}/${lang}/annual-revenue-selection`);
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save business category');
    } finally {
      setLoading(false);
    }
  }, [selectedId, businessName, phoneNumber, merchantId, lang, router]);

  return {
    searchQuery,
    setSearchQuery,
    selectedId,
    setSelectedId,
    businessName,
    setBusinessName,
    phoneNumber,
    setPhoneNumber,
    filteredCategories,
    loading,
    error,
    handleSubmit,
  };
}
