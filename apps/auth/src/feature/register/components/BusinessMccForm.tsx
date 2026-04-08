'use client';
import React from 'react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'zap-design/src/genesis/atoms/interactive/select';
import { Input } from 'zap-design/src/genesis/atoms/interactive/input';
import { HelpCircle, Info } from 'lucide-react';
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
import { useBusinessMcc, MOCK_CATEGORIES } from '../hooks/use-business-mcc';
import { cn } from 'zap-design/src/lib/utils';
import { useRouter, useParams } from 'next/navigation';

interface BusinessMccFormProps {
  merchantId: string;
  lang: string;
}

export function BusinessMccForm({ merchantId, lang }: BusinessMccFormProps) {
  const {
    selectedId,
    setSelectedId,
    businessName,
    setBusinessName,
    phoneNumber,
    setPhoneNumber,
    loading,
    handleSubmit,
    searchQuery,
    setSearchQuery,
    filteredCategories,
  } = useBusinessMcc(merchantId, lang);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const router = useRouter();

  const handleFinishLater = () => {
    setIsModalOpen(true);
  };

  const confirmFinishLater = () => {
    toast.success('Progress saved. You can finish this later.');
    router.push(`/${merchantId}/${lang}/products`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-on-surface">
      {/* Finish Later Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[440px] p-8 rounded-3xl border-none shadow-2xl bg-layer-dialog">
          <DialogHeader className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-on-surface/5 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-3xl">save_as</span>
            </div>
            <DialogTitle className="text-3xl font-black tracking-tight leading-none !normal-case !text-transform-none">
              Finish later?
            </DialogTitle>
            <DialogDescription className="text-[17px] leading-relaxed text-muted-foreground font-medium opacity-90 !normal-case !text-transform-none">
              Your progress is saved securely. You can return to complete your business profile at any time from your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <DialogBody className="py-4" />

          <DialogFooter className="flex flex-col sm:flex-col gap-3 mt-4">
            <Button 
              onClick={confirmFinishLater}
              className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-bold text-lg transition-all active:scale-[0.98] !normal-case !text-transform-none"
            >
              Save and finish later
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
              className="w-full h-14 rounded-2xl font-bold text-on-surface/60 hover:text-on-surface hover:bg-on-surface/5 text-lg transition-all !normal-case !text-transform-none"
            >
              Keep going
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Header Actions */}
      <div className="w-full flex justify-end p-6 sticky top-0 bg-white/80 backdrop-blur-sm z-10 transition-all border-b border-transparent">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedId || loading}
          className={cn(
            "rounded-full px-10 py-2 text-[15px] font-bold h-11 transition-all !normal-case !text-transform-none",
            (!selectedId) ? "bg-black/5 text-on-surface/20" : "bg-black text-white hover:bg-black/90 active:scale-95 shadow-sm"
          )}
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Next'
          )}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center pt-20 px-6 pb-20">
        <div className="w-full max-w-[640px] space-y-4 mb-14 text-center">
          <h1 className="text-[44px] leading-[1] font-bold text-on-surface tracking-[-0.03em] !normal-case !text-transform-none px-4">
            What kind of business best describes {businessName || 'zap'}?
          </h1>
          <p className="text-[17px] leading-[1.5] text-on-surface/60 font-normal !normal-case !text-transform-none max-w-[540px] mx-auto opacity-70">
            Search or select your business type to help us categorize most of what you sell. We'll personalize Square to fit your business needs.
          </p>
        </div>

        <div className="w-full max-w-[580px] flex flex-col items-center">
          {/* Unified Multi-step/List Container */}
          <div className={cn(
            "w-full bg-white border border-black/10 rounded-[20px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.03)] group transition-all",
            showList ? "border-black/20" : "hover:border-black/20"
          )}>
            {/* Selection View or Search Input */}
            {selectedId && !showList ? (
              <div 
                className="w-full h-[76px] px-6 flex items-center justify-between cursor-pointer hover:bg-black/[0.01] transition-colors"
                onClick={() => {
                  setSelectedId('');
                  setSearchQuery('');
                  setShowList(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[24px] text-on-surface/30 font-light">search</span>
                  <div className="flex flex-col">
                    <span className="text-[17px] font-bold text-on-surface tracking-tight leading-tight">
                      {MOCK_CATEGORIES.find(c => c.id === selectedId)?.label}
                    </span>
                    <span className="text-[13px] text-on-surface/40 font-medium">
                      {MOCK_CATEGORIES.find(c => c.id === selectedId)?.category}
                    </span>
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-on-surface/5 rounded-full transition-colors flex items-center justify-center group/close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId('');
                    setSearchQuery('');
                    setShowList(true);
                  }}
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface/40 group-hover/close:text-on-surface transition-colors font-light">close</span>
                </button>
              </div>
            ) : (
              <div className={cn(
                "relative transition-all",
                showList && "border-b border-black/5"
              )}>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-on-surface/30 group-focus-within:text-on-surface transition-colors font-light">search</span>
                </div>
                <input 
                  type="text"
                  placeholder="Search business categories"
                  className="w-full h-14 pl-14 pr-6 bg-transparent outline-none text-[16px] font-medium transition-all !normal-case !text-transform-none placeholder:text-on-surface/30"
                  value={searchQuery}
                  onFocus={() => setShowList(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowList(true);
                  }}
                  autoFocus={showList}
                />
              </div>
            )}

            {/* Category List Part */}
            {showList && (
              <div className="max-h-[380px] overflow-y-auto scrollbar-thin animate-in fade-in slide-in-from-top-1 duration-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setSearchQuery(item.label);
                        setShowList(false);
                      }}
                      className={cn(
                        "w-full p-5 text-left border-b border-black/5 last:border-0 transition-all flex flex-col gap-1",
                        selectedId === item.id ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"
                      )}
                    >
                      <span className={cn(
                        "text-[16px] font-bold !normal-case !text-transform-none",
                        selectedId === item.id ? "text-on-surface" : "text-on-surface/90"
                      )}>
                        {item.label}
                      </span>
                      <span className="text-[12px] text-on-surface/40 font-medium !normal-case !text-transform-none">
                        {item.category}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-12 text-center text-on-surface/40">
                    <p className="font-medium text-[14px]">No categories found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * A reusable form section wrapper that matches the Square-style design:
 * Bordered container with an internal label at the top and subtext below.
 */
function FormSection({ label, children, subtext, icon, error }: { label: string, children: React.ReactNode, subtext?: string, icon?: React.ReactNode, error?: string }) {
  return (
    <div className="space-y-1 mb-6">
      <div className={cn(
        "w-full bg-white border rounded-xl p-4 transition-all flex flex-col gap-1 min-h-[82px] justify-center",
        error ? "border-red-500 ring-1 ring-red-500" : "border-outline-variant hover:border-black/20 focus-within:border-black"
      )}>
        <div className="flex justify-between items-center w-full">
          <label className="text-[13px] font-bold text-muted-foreground/80 tracking-tight !normal-case !text-transform-none">
            {label}
          </label>
          {icon && <div>{icon}</div>}
        </div>
        {children}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 px-1 py-1">
          <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
          <p className="text-[13px] font-bold text-red-500 !normal-case !text-transform-none">
            {error}
          </p>
        </div>
      )}
      {subtext && (
        <p className="text-[13px] leading-relaxed text-muted-foreground/70 font-medium px-1 !normal-case !text-transform-none">
          {subtext}
        </p>
      )}
    </div>
  );
}
