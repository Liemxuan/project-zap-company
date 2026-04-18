'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { Button } from '@/genesis/atoms/interactive/button';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { Textarea } from '@/genesis/atoms/interactive/textarea';
import { Tabs } from '@/genesis/atoms/interactive/Tabs';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Text } from '@/genesis/atoms/typography/text';
import { MediaUpload, ColorPicker } from '@/genesis/organisms/media-upload';
import { ModalAlert, AlertState } from '@/genesis/templates/modal/modalAlert';
import { AddItems } from '@/genesis/organisms/add-items';
import { AddLocation } from '@/genesis/organisms/add-location';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
    { id: 'ja', label: 'Japanese' },
] as const;

interface CategoryFields {
    name: string;
    shortName: string;
    printerName: string;
    description: string;
}

interface CateDetailProps {
    mode?: 'create' | 'edit' | 'view';
    item?: any | null;
    onCancel?: () => void;
    onSave?: (data?: any) => void;
    t: any;
    refresh?: () => void;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <Heading level={4} className="text-on-surface font-bold text-transform-primary">{title}</Heading>
            {description && (
                <Text size='body-small' className="text-muted-foreground">{description}</Text>
            )}
        </div>
    );
}

export default function CateDetail({ mode = 'create', item, onCancel, onSave, t, refresh }: CateDetailProps) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<string>('en');
    const isViewing = mode === 'view';

    const [langData, setLangData] = useState<Record<string, CategoryFields>>(() => {
        const initial = {
            en: { name: '', shortName: '', printerName: '', description: '' },
            vi: { name: '', shortName: '', printerName: '', description: '' },
            ja: { name: '', shortName: '', printerName: '', description: '' },
        };
        if (item) {
            // Mapping logic for Category
            const enTrans = item.translations?.find((t: any) => t.locale_id === 2 || t.language_code === 'en');
            const viTrans = item.translations?.find((t: any) => t.locale_id === 1 || t.language_code === 'vi');
            const jaTrans = item.translations?.find((t: any) => t.locale_id === 3 || t.language_code === 'ja');

            initial.en = {
                name: enTrans?.name || item.name || '',
                shortName: enTrans?.short_name || item.short_name || '',
                printerName: enTrans?.printer_name || item.printer_name || '',
                description: enTrans?.description || item.description || '',
            };
            initial.vi = {
                name: viTrans?.name || item.name || '',
                shortName: viTrans?.short_name || item.short_name || '',
                printerName: viTrans?.printer_name || item.printer_name || '',
                description: viTrans?.description || item.description || '',
            };
            initial.ja = {
                name: jaTrans?.name || item.name || '',
                shortName: jaTrans?.short_name || item.short_name || '',
                printerName: jaTrans?.printer_name || item.printer_name || '',
                description: jaTrans?.description || item.description || '',
            };
        }
        return initial;
    });

    const [selectedColor, setSelectedColor] = useState(item?.color || 'var(--color-primary)');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPrimaryIndex, setMediaPrimaryIndex] = useState<number | null>(0);
    const [selectedLocations, setSelectedLocations] = useState(item?.locations || [
        { id: 1, name: 'Main Street Coffee' },
        { id: 2, name: 'Airport Kiosk' }
    ]);
    const [selectedItems, setSelectedItems] = useState(item?.items || [
        { id: 1, name: 'Tra sen vang' },
        { id: 2, name: 'Tra thanh dao' },
        { id: 3, name: 'Tra thach dao' }
    ]);

    const [alert, setAlert] = useState<AlertState>({ type: null, message: null });
    const [isSaving, setIsSaving] = useState(false);

    const currentFields = langData[activeLang];
    const setField = (field: keyof CategoryFields, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        const payload = {
            name: langData.en.name,
            color: selectedColor,
            locations: selectedLocations,
            items: selectedItems,
            translations: [
                { locale_id: 1, ...langData.vi },
                { locale_id: 2, ...langData.en },
                { locale_id: 3, ...langData.ja },
            ]
        };

        console.log('Saving Category with payload:', payload);

        setTimeout(() => {
            setAlert({
                type: 'success',
                message: mode === 'create' ? (t.alert_create_success || 'Category created successfully') : (t.alert_update_success || 'Category updated successfully')
            });
            setTimeout(() => {
                if (onSave) onSave(payload);
                if (refresh) refresh();
            }, 800);
        }, 1000);
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            <div className="absolute top-4 left-6 right-6 z-50">
                <ModalAlert
                    alert={alert}
                    onClose={() => setAlert({ type: null, message: null })}
                />
            </div>

            <div className="sticky top-0 z-40 flex justify-center bg-background border-b border-outline-variant px-6">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="flex-1 overflow-auto p-10 space-y-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* ━━ 1. General Information ━━ */}
                    <section className="space-y-6">
                        <SectionHeading title={t.section_general || "General Information"} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                <Input
                                    variant="outlined"
                                    label={t.label_name || "Name"}
                                    placeholder={t.placeholder_name || "e.g. Beverages"}
                                    position={lp}
                                    value={currentFields.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    disabled={isViewing || isSaving}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        variant="outlined"
                                        label={t.label_short_name || "Short Name"}
                                        placeholder={t.placeholder_short_name || "e.g. BEV"}
                                        position={lp}
                                        value={currentFields.shortName}
                                        onChange={(e) => setField('shortName', e.target.value)}
                                        disabled={isViewing || isSaving}
                                    />
                                    <Input
                                        variant="outlined"
                                        label={t.label_printer_name || "Printer Name"}
                                        placeholder={t.placeholder_printer_name || "e.g. Drinks"}
                                        position={lp}
                                        value={currentFields.printerName}
                                        onChange={(e) => setField('printerName', e.target.value)}
                                        disabled={isViewing || isSaving}
                                    />
                                </div>

                                <Textarea
                                    label={t.label_description || "Description"}
                                    placeholder={t.placeholder_description || "Provide a detailed description..."}
                                    position={lp}
                                    rows={4}
                                    value={currentFields.description}
                                    onChange={(e) => setField('description', e.target.value)}
                                    className="bg-white"
                                    disabled={isViewing || isSaving}
                                />
                            </div>

                            <div className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col h-[200px] lg:h-auto overflow-hidden">
                                <div
                                    className="flex-1 transition-colors duration-500 flex items-center justify-center p-4"
                                    style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                                />
                                {!isViewing && (
                                    <ColorPicker
                                        value={selectedColor}
                                        onChange={setSelectedColor}
                                        triggerNode={
                                            <button className="w-full border-t border-outline-variant bg-white py-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                                <Text size="body-small" className="font-bold text-primary text-transform-primary">{t.label_color || "Edit Color"}</Text>
                                            </button>
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ━━ 2. Media ━━ */}
                    <MediaUpload
                        title={t.section_media || "Media"}
                        description=""
                        mediaFiles={mediaFiles}
                        onMediaFilesChange={(files) => !isViewing && setMediaFiles(files as any)}
                        primaryMediaIndex={mediaPrimaryIndex}
                        onPrimaryMediaIndexChange={setMediaPrimaryIndex}
                    />

                    {/* ━━ 3. Items ━━ */}
                    <section className="space-y-6">
                        <SectionHeading title={t.section_items || "Items"} />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedItems.length} {t.label_items_selected || "Items Selected"}</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedItems.map((item: any) => item.name).join(' \u2022 ')}
                                    </Text>
                                </div>
                                {!isViewing && (
                                    <AddItems
                                        selectedItems={selectedItems as any}
                                        onSelectionChange={setSelectedItems as any}
                                        trigger={<button className="text-primary font-bold hover:underline px-2 transition-all">{t.action_edit || "Edit"}</button>}
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ━━ 4. Locations ━━ */}
                    <section className="space-y-6">
                        <SectionHeading title={t.section_locations || "Locations"} />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedLocations.length} {t.label_locations_selected || "Locations Selected"}</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedLocations.map((loc: any) => loc.name).join(' \u2022 ')}
                                    </Text>
                                </div>
                                {!isViewing && (
                                    <AddLocation
                                        selectedLocations={selectedLocations}
                                        onSelectionChange={setSelectedLocations}
                                        trigger={<button className="text-primary font-bold hover:underline px-2 transition-all">{t.action_edit || "Edit"}</button>}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer Actions */}
            {!isViewing && (
                <div className="flex justify-end p-6 border-t border-outline-variant bg-white gap-3 sticky bottom-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                        {t.btn_cancel || 'Cancel'}
                    </Button>
                    <Button
                        variant="primary"
                        className="min-w-[120px] rounded-lg"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (t.label_saving || 'Saving...') : (t.btn_save || 'Save')}
                    </Button>
                </div>
            )}
        </div>
    );
}
