'use client';
import React from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody
} from 'zap-design/src/genesis/molecules/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAnnualRevenue, REVENUE_OPTIONS } from '../hooks/use-annual-revenue';
import { cn } from 'zap-design/src/lib/utils';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface AnnualRevenueFormProps {
  merchantId: string;
  lang: string;
}

export function AnnualRevenueForm({ merchantId, lang }: AnnualRevenueFormProps) {
  const {
    selectedId,
    setSelectedId,
    loading,
    handleSubmit,
  } = useAnnualRevenue(merchantId, lang);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleFinishLater = () => {
    setIsModalOpen(true);
  };

  const confirmFinishLater = () => {
    toast.success('Progress saved. You can finish this later.');
    router.push(`/${merchantId}/${lang}/products`);
  };

  const onOptionClick = (id: string) => {
    setSelectedId(id);
    // Auto submit on click for a smoother flow? 
    // Square often does this. Let's do it if it's not and 'Already Selected' state.
    handleSubmit(id);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-on-surface">
      <div className="flex-1 flex flex-col items-center pt-24 px-6 pb-20">
        <div className="w-full max-w-2xl space-y-3 mb-12 text-center">
          <h1 className="text-[40px] leading-[1.1] font-bold text-on-surface tracking-tight !normal-case !text-transform-none">
            What's your annual revenue?
          </h1>
          <p className="text-[17px] leading-[1.6] text-muted-foreground opacity-90 font-normal !normal-case !text-transform-none">
            This helps us provide the best solutions for your business.
          </p>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-3">
          {REVENUE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onOptionClick(option.id)}
              disabled={loading}
              className={cn(
                "w-full p-6 text-left border rounded-2xl transition-all duration-200 flex justify-between items-center group",
                "hover:border-black/20 hover:bg-on-surface/5",
                selectedId === option.id
                  ? "border-black bg-on-surface/5 ring-1 ring-black"
                  : "border-outline-variant bg-white"
              )}
            >
              <div className="flex flex-col gap-1.5">
                <span className={cn(
                  "text-[17px] font-bold !normal-case !text-transform-none",
                  selectedId === option.id ? "text-on-surface" : "text-on-surface/80"
                )}>
                  {option.label}
                </span>
                {option.subtext && (
                  <span className="text-[14px] text-muted-foreground/70 font-medium leading-relaxed !normal-case !text-transform-none">
                    {option.subtext}
                  </span>
                )}
              </div>
              <ChevronRight
                size={20}
                className={cn(
                  "text-on-surface/20 group-hover:text-on-surface/40 transition-colors",
                  selectedId === option.id && "text-on-surface"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
