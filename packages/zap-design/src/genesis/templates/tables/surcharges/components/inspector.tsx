import React from 'react';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Pill } from '@/genesis/atoms/status/pills';

interface SurchargeInspectorProps {
    selectedSurcharge: any;
    filters: any[];
    onFilterToggle: (groupId: string, optionId: string) => void;
    t: any;
}

export const SurchargeInspector: React.FC<SurchargeInspectorProps> = ({
    selectedSurcharge,
    filters,
    onFilterToggle,
    t
}) => {
    return (
        <div className="flex flex-col h-full overflow-hidden min-w-[320px]">
            {/* Inspector Header */}
            <div className="h-14 border-b border-border flex items-center px-4 justify-between shrink-0 bg-layer-panel">
                <div className="flex items-center gap-2">
                    <Icon name="tune" size={18} className="text-primary" />
                    <span className="font-bold text-xs uppercase tracking-widest text-on-surface font-display">{t.label_inspector}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Active Selection Info */}
                {selectedSurcharge ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-mono opacity-50 uppercase tracking-tighter">{selectedSurcharge.serial_id}</span>
                                <Pill variant={selectedSurcharge.status_color as any || 'success'}>{selectedSurcharge.status_text}</Pill>
                            </div>
                            <h3 className="font-bold text-lg text-on-surface leading-tight">{selectedSurcharge.name}</h3>
                            <div className="pt-2 border-t border-primary/10 grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] uppercase opacity-40 font-bold mb-1">{t.label_value}</span>
                                    <span className="text-sm font-mono font-bold">
                                        {selectedSurcharge.value_type === 'percentage' ? `${selectedSurcharge.value}%` : `${selectedSurcharge.value.toLocaleString()} VND`}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase opacity-40 font-bold mb-1">{t.label_type}</span>
                                    <span className="text-sm font-bold uppercase tracking-widest">{selectedSurcharge.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                        <Icon name="touch_app" size={32} />
                        <p className="text-xs font-medium px-4">{t.msg_selectSurcharge}</p>
                    </div>
                )}

                {/* Filters Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface opacity-40">
                        <div className="h-[1px] flex-1 bg-current" />
                        <span>{t.label_filters}</span>
                        <div className="h-[1px] flex-1 bg-current" />
                    </div>

                    {filters.map((group) => (
                        <div key={group.id} className="space-y-3">
                            <h4 className="text-[11px] font-bold text-on-surface/60 uppercase tracking-wider">{group.label}</h4>
                            <div className="flex flex-wrap gap-2">
                                {group.options.map((option: any) => (
                                    <button
                                        key={option.id}
                                        onClick={() => onFilterToggle(group.id, option.id)}
                                        className={`
                                            px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border
                                            ${option.isActive 
                                                ? 'bg-primary border-primary text-primary-foreground shadow-sm' 
                                                : 'bg-surface border-border text-on-surface/60 hover:border-primary/50'}
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
