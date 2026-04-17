'use client';

import { useState, useMemo } from 'react';
import { Pencil, Image as ImageIcon, Plus, X, Check, Pipette, Hash, Search, ChevronLeft, ChevronRight, CircleCheck, CircleAlert } from 'lucide-react';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/inputs';
import { Textarea } from '../../atoms/interactive/textarea';
import { SelectField, SelectItem } from '../../atoms/interactive/select';
import { Heading } from '../../atoms/typography/headings';
import { Text } from '../../atoms/typography/text';
import { useTheme } from '../../../components/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '../../molecules/popover';
import { Switch } from '../../atoms/interactive/switch';
import { Tabs } from '../../atoms/interactive/Tabs';
import { MediaUpload, SelectableCard, ColorPicker } from '../../organisms/media-upload';
import { AddItems } from '../../organisms/add-items';
import { AddLocation } from '../../organisms/add-location';
import { MultiSelectOption } from '../../atoms/interactive/multi-select';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'ja', label: '日本語' },
] as const;


interface CustomMultiSelectOption extends MultiSelectOption {
    image?: string;
}

const MOCK_ITEMS: CustomMultiSelectOption[] = [
    { label: 'Espresso', value: 'espresso', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=200&auto=format&fit=crop' },
    { label: 'Cappuccino', value: 'cappuccino', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=200&auto=format&fit=crop' },
    { label: 'Latte', value: 'latte', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=200&auto=format&fit=crop' },
    { label: 'Mocha', value: 'mocha', image: 'https://images.unsplash.com/photo-1596078841242-12f73df69716?q=80&w=200&auto=format&fit=crop' },
    { label: 'Americano', value: 'americano', image: 'https://images.unsplash.com/photo-1551030173-122adabc44f9?q=80&w=200&auto=format&fit=crop' },
];

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

export default function GroupCreateTemplate({ onCancel, onSave }: { onCancel?: () => void; onSave?: (data: any) => void }) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['id']>('en');

    const [langData, setLangData] = useState<Record<string, { name: string; shortName: string; printerName: string; description: string }>>({
        en: { name: '', shortName: '', printerName: '', description: '' },
        vi: { name: '', shortName: '', printerName: '', description: '' },
        ja: { name: '', shortName: '', printerName: '', description: '' },
    });

    const [selectedColor, setSelectedColor] = useState('var(--color-primary)');
    const [mediaFiles, setMediaFiles] = useState<(File | string)[]>([]);
    const [mediaPrimaryIndex, setMediaPrimaryIndex] = useState<number | null>(null);

    const [bannerFiles, setBannerFiles] = useState<(File | string)[]>([]);
    const [bannerPrimaryIndex, setBannerPrimaryIndex] = useState<number | null>(null);

    const [selectedLocations, setSelectedLocations] = useState([
        { id: 1, name: 'Main Street Coffee' },
        { id: 2, name: 'Airport Kiosk' }
    ]);

    const [selectedItems, setSelectedItems] = useState([
        { id: 1, name: 'Tra sen vang' },
        { id: 2, name: 'Tra thanh dao' },
        { id: 3, name: 'Tra thach dao' }
    ]);

    const currentFields = langData[activeLang];
    const setField = (field: string, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    return (
        <div className="flex-1 overflow-auto bg-layer-canvas bg-white">
            {/* Language tabs — sticky below dialog header, centered */}
            <div className="sticky top-0 z-100 flex justify-center gap-0 border-b border-outline-variant bg-background -mx-6 md:-mx-10 px-6 md:px-10">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={(id) => setActiveLang(id as typeof LANGUAGES[number]['id'])}
                    className="border-none pb-0"
                />
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-12 py-10 px-6">

                {/* ━━ 1. Basic Information ━━ */}

                <section className="space-y-6">
                    <SectionHeading
                        title="Basic Information"
                    />
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <Input
                                    variant="outlined"
                                    label="Name"
                                    placeholder="e.g. Signature Coffee"
                                    position={lp}
                                    value={currentFields.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                />

                                <Input
                                    variant="outlined"
                                    label="Short Name"
                                    placeholder="e.g. SIG-COFFEE"
                                    position={lp}
                                    value={currentFields.shortName}
                                    onChange={(e) => setField('shortName', e.target.value)}
                                />
                                <Input
                                    variant="outlined"
                                    label="Printer Name"
                                    placeholder="e.g. Kitchen Printer 1"
                                    position={lp}
                                    value={currentFields.printerName}
                                    onChange={(e) => setField('printerName', e.target.value)}
                                />

                            </div>
                            <div
                                className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col h-[124px] lg:h-auto"
                            >
                                <div
                                    className="flex-1 rounded-t-xl transition-colors duration-500 flex items-center justify-center p-4"
                                    style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                                >
                                    {/* Color Indicator Area */}
                                </div>
                                <ColorPicker
                                    value={selectedColor}
                                    onChange={setSelectedColor}
                                    triggerNode={
                                        <button className="w-full border-t border-outline-variant bg-white py-3 text-center cursor-pointer hover:bg-slate-50 transition-colors rounded-b-xl">
                                            <Text size="body-small" className="font-bold text-primary text-transform-primary">Edit Color</Text>
                                        </button>
                                    }
                                />
                            </div>
                        </div>

                        <Textarea
                            label="Description"
                            placeholder="Provide a detailed description..."
                            position={lp}
                            rows={4}
                            value={currentFields.description}
                            onChange={(e) => setField('description', e.target.value)}
                            className="bg-white"
                        />
                    </div>
                </section>

                <MediaUpload
                    title="Media"
                    description=""
                    mediaFiles={mediaFiles}
                    onMediaFilesChange={(files) => setMediaFiles(files)}
                    primaryMediaIndex={mediaPrimaryIndex}
                    onPrimaryMediaIndexChange={setMediaPrimaryIndex}
                />
                {/* ━━ 3. Banner ━━ */}
                <MediaUpload
                    title="Banner"
                    description=""
                    mediaFiles={bannerFiles}
                    onMediaFilesChange={(files) => setBannerFiles(files)}
                    primaryMediaIndex={bannerPrimaryIndex}
                    onPrimaryMediaIndexChange={setBannerPrimaryIndex}
                />
                {/* ━━ 4. Locations ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Locations"
                    />
                    <div className="space-y-4">
                        {selectedLocations.length > 0 ?
                            (
                                <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                    <div className="space-y-1">
                                        <Text className="font-bold text-on-surface">{selectedLocations.length} Locations</Text>
                                        <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                            {selectedLocations.map(loc => loc.name).join(' \u2022 ')}
                                        </Text>
                                    </div>
                                    <AddLocation
                                        selectedLocations={selectedLocations as any}
                                        onSelectionChange={setSelectedLocations as any}
                                        trigger={<button className="text-primary font-bold hover:underline px-2 transition-all">Edit</button>}
                                    />
                                </div>
                            )
                            : (
                                <AddLocation
                                    selectedLocations={selectedLocations}
                                    onSelectionChange={setSelectedLocations}
                                    trigger={
                                        <Button variant="primary" className="px-10 bg-black/40 hover:bg-black/60 text-white tracking-wide border-none rounded-xl h-11 w-full text-[15px] font-bold shadow-md">
                                            Add Locations
                                        </Button>
                                    }
                                />
                            )
                        }


                    </div>
                </section>
                {/* ━━ 5. Items ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Items"
                    />
                    <div className="space-y-4">
                        {selectedItems.length > 0 ? (
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedItems.length} Items</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedItems.map(item => item.name).join(' \u2022 ')}
                                    </Text>
                                </div>
                                <AddItems
                                    selectedItems={selectedItems as any}
                                    onSelectionChange={setSelectedItems as any}
                                    trigger={<button className="text-primary font-bold hover:underline px-2 transition-all">Edit</button>}
                                />
                            </div>
                        )
                            : (
                                <AddItems
                                    selectedItems={selectedItems}
                                    onSelectionChange={setSelectedItems}
                                    trigger={
                                        <Button variant="primary" className="px-10 bg-black/40 hover:bg-black/60 text-white tracking-wide border-none rounded-xl h-11 w-full text-[15px] font-bold shadow-md">
                                            Add Items
                                        </Button>
                                    }
                                />
                            )
                        }



                    </div>
                </section>
            </div>
        </div>
    );
}
