import React, { useState } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { Button } from '@/genesis/atoms/interactive/button';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { SelectField, SelectItem } from '@/genesis/atoms/interactive/select';
import { Tabs } from '@/genesis/atoms/interactive/Tabs';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Text } from '@/genesis/atoms/typography/text';

import { removeAccents, getInitials } from '@/lib/utils';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
] as const;

import { Switch } from '@/genesis/atoms/interactive/switch';
import { Unit } from '@/services/unit/unit.model';
import { unitService } from '@/services/unit/unit.service';
import { ModalAlert, AlertState } from '@/genesis/templates/modal/modalAlert';

interface UnitFields {
    name: string;
    symbol: string;
    precision: string;
    acronymn: string;
}

interface UnitDetailProps {
    mode?: 'create' | 'edit' | 'view';
    item?: Unit | null;
    onCancel?: () => void;
    onSave?: () => void;
    t: any;
    refresh?: () => void;
}

export default function UnitDetail({ mode = 'create', item, onCancel, onSave, t, refresh }: UnitDetailProps) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<string>('en');

    const isViewing = mode === 'view';

    const [viFields, setViFields] = useState<UnitFields>(() => {
        const fields = { name: '', symbol: '', precision: '0', acronymn: '' };
        if (item) {
            // Find Vietnamese translation (locale_id: 1)
            const trans = item.translations?.find((t: any) => t.locale_id === 1 || t.language_code === 'vi' || t.locale === 'vi');

            fields.name = trans?.name || item.name || '';
            // Priority: item.symbol (frontend/updated API), item.abbreviation (legacy API), item.code (fallback)
            fields.symbol = item.symbol || (item as any).abbreviation || '';
            fields.precision = item.precision?.toString() || '0';
            fields.acronymn = item.acronymn || getInitials(fields.name);
        }
        return fields;
    });

    const [enFields, setEnFields] = useState<UnitFields>(() => {
        const fields = { name: '', symbol: '', precision: '0', acronymn: '' };
        if (item) {
            // Find English translation (locale_id: 2)
            const trans = item.translations?.find((t: any) => t.locale_id === 2 || t.language_code === 'en' || t.locale === 'en');

            fields.name = trans?.name || item.name || '';
            fields.symbol = item.symbol || (item as any).abbreviation || '';
            fields.precision = item.precision?.toString() || '0';
            fields.acronymn = item.acronymn || getInitials(fields.name);
        }
        return fields;
    });

    const [isActive, setIsActive] = useState(item?.is_active ?? true);
    const [alert, setAlert] = useState<AlertState>({ type: null, message: null });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (field: keyof UnitFields, value: string) => {
        if (activeLang === 'en') {
            setEnFields(prev => {
                const next = { ...prev, [field]: value };
                // Auto-generate acronym from name if acronym is empty or matches previous auto-gen
                if (field === 'name' && (!prev.acronymn || prev.acronymn === getInitials(prev.name))) {
                    next.acronymn = getInitials(value);
                }
                return next;
            });
        } else {
            setViFields(prev => {
                const next = { ...prev, [field]: value };
                if (field === 'name' && (!prev.acronymn || prev.acronymn === getInitials(prev.name))) {
                    next.acronymn = getInitials(value);
                }
                return next;
            });
        }
    };

    const currentFields = activeLang === 'en' ? enFields : viFields;

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setAlert({ type: null, message: null });

        const payload = {
            name: enFields.name,
            symbol: enFields.symbol || viFields.symbol,
            acronymn: enFields.acronymn || viFields.acronymn,
            precision: parseInt(enFields.precision || viFields.precision || '0'),
            translations: [
                {
                    locale_id: 1, // Vietnamese
                    name: viFields.name
                },
                {
                    locale_id: 2, // English
                    name: enFields.name
                }
            ]
        };

        try {
            let res;
            if (mode === 'create') {
                res = await unitService.createUnit(payload);
            } else if (mode === 'edit' && item?.id) {
                res = await unitService.updateUnit(item.id, payload);
            }

            if (res?.success) {
                setAlert({
                    type: 'success',
                    message: mode === 'create' ? t.alert_create_success : t.alert_update_success,
                });

                // Auto-close after a short delay to show success
                setTimeout(() => {
                    if (onSave) onSave();
                    if (refresh) refresh();
                }, 800);
            } else {
                setAlert({
                    type: 'destructive',
                    message: t.alert_save_error,
                    subMessage: t.alert_save_error_sub
                });
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Failed to save unit:', error);
            setAlert({
                type: 'destructive',
                message: t.alert_error,
                subMessage: t.alert_error_sub
            });
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            <div className="absolute top-4 left-6 right-6 z-50">
                <ModalAlert
                    alert={alert}
                    onClose={() => setAlert({ type: null, message: null })}
                />
            </div>
            {/* Header Tabs Matching Image */}
            <div className="flex justify-center bg-background border-outline-variant px-6">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="flex-1 overflow-auto p-10 space-y-12">
                <section className="max-w-xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <Heading level={4} className="text-on-surface font-bold">{t.section_general || "General Information"}</Heading>
                    </div>
                    <div className="space-y-6">
                        <Input
                            variant="outlined"
                            type="text"
                            placeholder={t.field_name || "Name"}
                            position={lp}
                            label={t.field_name || "Name"}
                            className="bg-white border-outline-variant h-14"
                            value={currentFields.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            disabled={isViewing || isSaving}
                        />

                        <Input
                            variant="outlined"
                            type="text"
                            placeholder={t.field_shortName || "Symbol"}
                            position={lp}
                            label={t.field_shortName || "Symbol"}
                            className="bg-white border-outline-variant h-14"
                            value={currentFields.symbol}
                            onChange={(e) => updateField('symbol', e.target.value)}
                            disabled={isViewing || isSaving}
                        />

                        <Input
                            variant="outlined"
                            type="text"
                            placeholder={t.field_acronym || "Acronym"}
                            position={lp}
                            label={t.field_acronym || "Acronym"}
                            className="bg-white border-outline-variant h-14"
                            value={currentFields.acronymn}
                            onChange={(e) => updateField('acronymn', e.target.value)}
                            disabled={isViewing || isSaving}
                        />

                        <SelectField
                            label={t.field_precision || "Precision"}
                            position={lp}
                            placeholder={t.field_precision || "Precision"}
                            value={currentFields.precision}
                            onValueChange={(val) => updateField('precision', val)}
                            bgColor="white"
                            triggerClassName="border border-outline-variant bg-white h-14"
                            disabled={isViewing || isSaving}
                        >
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">0.1</SelectItem>
                            <SelectItem value="3">0.01</SelectItem>
                            <SelectItem value="4">0.001</SelectItem>
                            <SelectItem value="5">0.0001</SelectItem>
                        </SelectField>
                    </div>
                </section>
            </div>

            {/* Footer Actions */}
            {!isViewing && (
                <div className="flex justify-end p-6 border-t border-outline-variant bg-white gap-3">
                    <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                        {t.btn_cancel || 'Cancel'}
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        className="min-w-[120px] rounded-lg"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (t.label_saving || 'Saving...') : (mode === 'create' ? (t.btn_create || 'Create') : (t.btn_save || 'Save'))}
                    </Button>
                </div>
            )}
        </div>
    );
}
