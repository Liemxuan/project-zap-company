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

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
] as const;

interface BrandFields {
    name: string;
    tradingName: string;
    description: string;
    website: string;
    email: string;
    address: string;
}

interface BrandDetailProps {
    mode?: 'create' | 'edit' | 'view';
    item?: any | null;
    onCancel?: () => void;
    onSave?: () => void;
    t: any;
    refresh?: () => void;
}

export function BrandDetail({ mode = 'create', item, onCancel, onSave, t, refresh }: BrandDetailProps) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<string>('en');
    const isViewing = mode === 'view';

    const [langData, setLangData] = useState<Record<string, BrandFields>>(() => {
        const initial = {
            en: { name: '', tradingName: '', description: '', website: '', email: '', address: '' },
            vi: { name: '', tradingName: '', description: '', website: '', email: '', address: '' },
        };
        if (item) {
            // English (locale_id: 2)
            const enTrans = item.translations?.find((t: any) => t.locale_id === 2 || t.language_code === 'en');
            initial.en = {
                name: enTrans?.name || item.name || '',
                tradingName: enTrans?.trading_name || item.trading_name || '',
                description: enTrans?.description || item.description || '',
                website: item.website || '',
                email: item.email || '',
                address: item.address || '',
            };

            // Vietnamese (locale_id: 1)
            const viTrans = item.translations?.find((t: any) => t.locale_id === 1 || t.language_code === 'vi');
            initial.vi = {
                name: viTrans?.name || item.name || '',
                tradingName: viTrans?.trading_name || item.trading_name || '',
                description: viTrans?.description || item.description || '',
                website: item.website || '',
                email: item.email || '',
                address: item.address || '',
            };
        }
        return initial;
    });

    const [selectedColor, setSelectedColor] = useState(item?.color || 'var(--color-primary)');
    const [logoFiles, setLogoFiles] = useState<(File | string)[]>(item?.logo_url ? [item.logo_url] : []);
    const [imageFiles, setImageFiles] = useState<(File | string)[]>(item?.images || []);
    const [selectedItems, setSelectedItems] = useState(item?.items || []);
    const [alert, setAlert] = useState<AlertState>({ type: null, message: null });
    const [isSaving, setIsSaving] = useState(false);

    const currentFields = langData[activeLang];
    const setField = (field: keyof BrandFields, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);

        const payload = {
            name: langData.en.name,
            trading_name: langData.en.tradingName,
            description: langData.en.description,
            website: langData.en.website || langData.vi.website,
            email: langData.en.email || langData.vi.email,
            address: langData.en.address || langData.vi.address,
            color: selectedColor,
            translations: [
                {
                    locale_id: 1, // Vietnamese
                    name: langData.vi.name,
                    trading_name: langData.vi.tradingName,
                    description: langData.vi.description
                },
                {
                    locale_id: 2, // English
                    name: langData.en.name,
                    trading_name: langData.en.tradingName,
                    description: langData.en.description
                }
            ]
        };

        console.log('Saving Brand with translations:', payload);

        // Mock save logic to match UnitDetail behavior
        setTimeout(() => {
            setAlert({
                type: 'success',
                message: mode === 'create' ? (t.alert_create_success || 'Brand created successfully') : (t.alert_update_success || 'Brand updated successfully')
            });
            setTimeout(() => {
                if (onSave) onSave();
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

            <div className="flex justify-center bg-background border-b border-outline-variant px-6">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="flex-1 overflow-auto p-10 space-y-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* ━━ 1. Basic Information ━━ */}
                    <section className="space-y-6">
                        <Heading level={4} className="text-on-surface font-bold text-transform-primary">{t.section_general || "General Information"}</Heading>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                <Input
                                    variant="outlined"
                                    label={t.label_name || "Name"}
                                    placeholder={t.placeholder_name || "e.g. Acme Corp"}
                                    position={lp}
                                    value={currentFields.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    disabled={isViewing || isSaving}
                                />

                                <Input
                                    variant="outlined"
                                    label={t.label_trading_name || "Reference ID"}
                                    placeholder={t.placeholder_trading_name || "e.g. ACME-001"}
                                    position={lp}
                                    value={currentFields.tradingName}
                                    onChange={(e) => setField('tradingName', e.target.value)}
                                    disabled={isViewing || isSaving}
                                />

                                <Textarea
                                    label={t.label_description || "Description"}
                                    placeholder={t.placeholder_description || "Brief description..."}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Input
                                variant="outlined"
                                type="email"
                                label={t.label_email || "Email"}
                                placeholder={t.placeholder_email || "brand@acme.com"}
                                position={lp}
                                value={currentFields.email}
                                onChange={(e) => setField('email', e.target.value)}
                                disabled={isViewing || isSaving}
                            />
                            <Input
                                variant="outlined"
                                type="text"
                                label={t.label_website || "Website"}
                                placeholder={t.placeholder_website || "https://acme.com"}
                                position={lp}
                                value={currentFields.website}
                                onChange={(e) => setField('website', e.target.value)}
                                disabled={isViewing || isSaving}
                            />
                            <Input
                                variant="outlined"
                                type="text"
                                label={t.label_address || "Address"}
                                placeholder={t.placeholder_address || "123 Main St, USA"}
                                position={lp}
                                className="md:col-span-2 lg:col-span-1"
                                value={currentFields.address}
                                onChange={(e) => setField('address', e.target.value)}
                                disabled={isViewing || isSaving}
                            />
                        </div>
                    </section>

                    {/* ━━ 2. Media ━━ */}
                    <MediaUpload
                        title={t.label_logo || "Logo"}
                        mediaFiles={logoFiles.filter((f): f is File => f instanceof File)}
                        onMediaFilesChange={(files) => !isViewing && setLogoFiles(files)}
                        primaryMediaIndex={0}
                        onPrimaryMediaIndexChange={() => { }}
                    />
                    <MediaUpload
                        title={t.label_images || "Images"}
                        mediaFiles={imageFiles.filter((f): f is File => f instanceof File)}
                        onMediaFilesChange={(files) => !isViewing && setImageFiles(files)}
                        primaryMediaIndex={0}
                        onPrimaryMediaIndexChange={() => { }}
                    />

                    {/* ━━ 3. Items ━━ */}
                    <section className="space-y-6">
                        <Heading level={4} className="text-on-surface font-bold text-transform-primary">{t.section_items || "Items"}</Heading>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedItems.length} {t.label_items_selected || "Items Selected"}</Text>
                                    <div className="flex items-center justify-between">
                                        <Text size="body-small" className="text-muted-foreground italic">{t.label_items_coming_soon || "Items selection coming soon..."}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer Actions */}
            {!isViewing && (
                <div className="flex justify-end p-6 border-t border-outline-variant bg-white gap-3">
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
