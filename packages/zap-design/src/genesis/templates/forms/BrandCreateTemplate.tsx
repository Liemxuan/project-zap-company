'use client';

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/inputs';
import { SelectField, SelectItem } from '../../atoms/interactive/select';
import { Textarea } from '../../atoms/interactive/textarea';
import { Tabs } from '../../atoms/interactive/Tabs';
import { Heading } from '../../atoms/typography/headings';
import { Text } from '../../atoms/typography/text';
import { Pencil, Image as ImageIcon, Plus, X, Check, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaUpload, ColorPicker } from '../../organisms/media-upload';
import { AddItems } from '../../organisms/add-items';
import { AddLocation } from '../../organisms/add-location';
import { Switch } from '../../atoms/interactive/switch';


const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
    { id: 'ja', label: '日本語' },
] as const;

interface BrandFields {
    name: string;
    tradingName: string;
    description: string;
    website: string;
    email: string;
    address: string;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <Heading level={4} className="text-transform-primary">{title}</Heading>
            {description && (
                <Text size='body-small' className="text-muted-foreground">{description}</Text>
            )}
        </div>
    );
}

const MOCK_ITEMS = [
    { label: 'Espresso', value: 'espresso', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=200&auto=format&fit=crop' },
    { label: 'Cappuccino', value: 'cappuccino', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=200&auto=format&fit=crop' },
    { label: 'Latte', value: 'latte', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=200&auto=format&fit=crop' },
    { label: 'Mocha', value: 'mocha', image: 'https://images.unsplash.com/photo-1596078841242-12f73df69716?q=80&w=200&auto=format&fit=crop' },
    { label: 'Americano', value: 'americano', image: 'https://images.unsplash.com/photo-1551030173-122adabc44f9?q=80&w=200&auto=format&fit=crop' },
];

export default function BrandCreateTemplate({ onCancel }: { onCancel?: () => void }) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<string>('en');

    const [langData, setLangData] = useState<Record<string, BrandFields>>({
        en: { name: '', tradingName: '', description: '', website: '', email: '', address: '' },
        vi: { name: '', tradingName: '', description: '', website: '', email: '', address: '' },
        ja: { name: '', tradingName: '', description: '', website: '', email: '', address: '' },
    });

    const currentFields = langData[activeLang];
    const setField = (field: keyof BrandFields, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    const [logoFiles, setLogoFiles] = useState<(File | string)[]>([]);
    const [logoPrimaryIndex, setLogoPrimaryIndex] = useState<number | null>(null);

    const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
    const [imagePrimaryIndex, setImagePrimaryIndex] = useState<number | null>(null);

    const [selectedColor, setSelectedColor] = useState('var(--color-primary)');

    const [selectedItems, setSelectedItems] = useState([
        { id: 1, name: 'Tra sen vang' },
        { id: 2, name: 'Tra thanh dao' },
        { id: 3, name: 'Tra thach dao' },
        { id: 4, name: 'Tra thach vai' },
        { id: 5, name: 'Tra dau do' },
        { id: 6, name: 'Freeze tra xanh' },
        { id: 7, name: 'Tra socola' }
    ]);



    return (
        <div className="flex-1 overflow-auto bg-layer-canvas bg-white">
            {/* Language tabs — sticky below header */}
            <div className="sticky top-0 z-100 flex justify-center gap-0 border-b border-outline-variant bg-background -mx-6 md:-mx-10 px-6 md:px-10">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-12 py-10 px-6">

                {/* ━━ 1. Basic Information ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="General Information"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <Input
                                variant="outlined"
                                label="Name"
                                placeholder="e.g. Acme Corp"
                                position={lp}
                                value={currentFields.name}
                                onChange={(e) => setField('name', e.target.value)}
                            />

                            <Input
                                variant="outlined"
                                label="Reference ID"
                                placeholder="e.g. ACME-001"
                                position={lp}
                                value={currentFields.tradingName}
                                onChange={(e) => setField('tradingName', e.target.value)}
                            />

                            <Textarea
                                label="Description"
                                placeholder="Brief description of the brand's vision and values..."
                                position={lp}
                                rows={4}
                                value={currentFields.description}
                                onChange={(e) => setField('description', e.target.value)}
                                className="bg-white"
                            />

                        </div>

                        <div className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col h-[200px] lg:h-auto overflow-hidden">
                            <div
                                className="flex-1 transition-colors duration-500 flex items-center justify-center p-4 bg-layer-variant"
                                style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                            >
                                {/* Brand Color Identity */}
                            </div>
                            <ColorPicker
                                value={selectedColor}
                                onChange={setSelectedColor}
                                triggerNode={
                                    <button className="w-full border-t border-outline-variant bg-white py-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                        <Text size="body-small" className="font-bold text-primary text-transform-primary">Edit Color</Text>
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">

                        <Input
                            variant="outlined"
                            type="email"
                            label="Email"
                            placeholder="brand@acme.com"
                            position={lp}
                            value={currentFields.email}
                            onChange={(e) => setField('email', e.target.value)}
                        />
                        <Input
                            variant="outlined"
                            type="text"
                            label="Address"
                            placeholder="123 Main St, Anytown, USA"
                            position={lp}
                            value={currentFields.address}
                            onChange={(e) => setField('address', e.target.value)}
                        />
                    </div>
                </section>

                <MediaUpload
                    title="Logo"
                    description=""
                    mediaFiles={logoFiles}
                    onMediaFilesChange={(files) => setLogoFiles(files)}
                    primaryMediaIndex={logoPrimaryIndex}
                    onPrimaryMediaIndexChange={setLogoPrimaryIndex}
                />
                {/* 3. Images */}
                <MediaUpload
                    title="Images"
                    description=""
                    mediaFiles={imageFiles}
                    onMediaFilesChange={(files) => setImageFiles(files)}
                    primaryMediaIndex={imagePrimaryIndex}
                    onPrimaryMediaIndexChange={setImagePrimaryIndex}
                />
                {/* 4. Items */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Items"
                    />
                    <div className="space-y-4">
                        {selectedItems.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedItems.length} Items</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedItems.map(item => item.name).join(' \u2022 ')}
                                        {selectedItems.length > 6 && '... + 1 more'}
                                    </Text>
                                </div>
                                <AddItems
                                    selectedItems={selectedItems}
                                    onSelectionChange={setSelectedItems}
                                    trigger={<button className="text-primary font-bold hover:underline px-2 transition-all">Edit</button>}
                                />
                            </div>
                        )}

                        <AddItems
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            trigger={
                                <div className="w-full h-14 bg-surface-container rounded-xl flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
                                    <Button variant="primary" className="px-10 bg-black/40 hover:bg-black/60 text-white tracking-wide border-none rounded-xl h-11 w-full text-[15px] font-bold">
                                        {selectedItems.length > 0 ? 'Add More Items' : 'Add Items'}
                                    </Button>

                                </div>
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
