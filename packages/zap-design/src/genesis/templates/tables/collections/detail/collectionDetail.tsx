'use client';

import { useState, useMemo } from 'react';
import { Pencil, Image as ImageIcon, Plus, X, Check, Pipette, Hash, Search, ChevronLeft, ChevronRight, CircleCheck, CircleAlert } from 'lucide-react';
import { Button } from '@/genesis/atoms/interactive/button';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { Textarea } from '@/genesis/atoms/interactive/textarea';
import { SelectField, SelectItem } from '@/genesis/atoms/interactive/select';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Text } from '@/genesis/atoms/typography/text';
import { useTheme } from '@/components/ThemeContext';
import { MultiSelect, MultiSelectOption } from '@/genesis/atoms/interactive/multi-select';
import { Dropzone } from '@/genesis/atoms/interactive/dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/genesis/molecules/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogTrigger, DialogFooter, DialogClose } from '@/genesis/molecules/dialog';
import { Switch } from '@/genesis/atoms/interactive/switch';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { Tabs } from '@/genesis/atoms/interactive/Tabs';
import { MediaUpload, SelectableCard, ColorPicker } from '@/genesis/organisms/media-upload';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/genesis/molecules/pagination';
import { AlertState, ModalAlert } from '@/genesis/templates/modal/modalAlert';
import { Collection } from '@/services/collection/collection.model';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'ja', label: '日本語' },
] as const;

interface CollectionFields {
    name: string;
    shortName: string;
    printerName: string;
    description: string;
}

interface CollectionDetailProps {
    mode?: 'create' | 'edit' | 'view';
    item?: Collection | null;
    onCancel?: () => void;
    onSave?: (data: any) => void;
    t: any;
    refresh?: () => void;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <Heading level={4} className="text-transform-primary font-bold">{title}</Heading>
            {description && (
                <Text size='body-small' className="text-muted-foreground">{description}</Text>
            )}
        </div>
    );
}

export default function CollectionDetail({ mode = 'create', item, onCancel, onSave, t, refresh }: CollectionDetailProps) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['id']>('en');
    const isViewing = mode === 'view';

    const [langData, setLangData] = useState<Record<string, CollectionFields>>(() => {
        const initial = {
            en: { name: '', shortName: '', printerName: '', description: '' },
            vi: { name: '', shortName: '', printerName: '', description: '' },
            ja: { name: '', shortName: '', printerName: '', description: '' },
        };
        if (item) {
            // Mapping translations
            const findTrans = (locale: number | string) =>
                item.translations?.find((tr: any) => tr.locale_id === locale || tr.language_code === locale || tr.locale === locale);

            const en = findTrans(2) || findTrans('en');
            const vi = findTrans(1) || findTrans('vi');
            const ja = findTrans(3) || findTrans('ja');

            initial.en = {
                name: en?.name || item.name || '',
                shortName: (en as any)?.short_name || '',
                printerName: (en as any)?.printer_name || '',
                description: en?.description || '',
            };
            initial.vi = {
                name: vi?.name || item.name || '',
                shortName: (vi as any)?.short_name || '',
                printerName: (vi as any)?.printer_name || '',
                description: vi?.description || '',
            };
            initial.ja = {
                name: ja?.name || '',
                shortName: (ja as any)?.short_name || '',
                printerName: (ja as any)?.printer_name || '',
                description: ja?.description || '',
            };
        }
        return initial;
    });

    const [selectedColor, setSelectedColor] = useState('var(--color-primary)');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPrimaryIndex, setMediaPrimaryIndex] = useState<number | null>(null);

    const [bannerFiles, setBannerFiles] = useState<File[]>([]);
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

    const [alert, setAlert] = useState<AlertState>({
        type: null,
        message: null,
    });

    const [isSaving, setIsSaving] = useState(false);

    const currentFields = langData[activeLang];
    const setField = (field: keyof CollectionFields, value: string) => {
        if (isViewing) return;
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setAlert({ type: null, message: null });

        try {
            // Prepare translations payload
            const translations = [
                {
                    locale_id: 2, // en
                    name: langData.en.name,
                    short_name: langData.en.shortName,
                    printer_name: langData.en.printerName,
                    description: langData.en.description
                },
                {
                    locale_id: 1, // vi
                    name: langData.vi.name,
                    short_name: langData.vi.shortName,
                    printer_name: langData.vi.printerName,
                    description: langData.vi.description
                },
                {
                    locale_id: 3, // ja
                    name: langData.ja.name,
                    short_name: langData.ja.shortName,
                    printer_name: langData.ja.printerName,
                    description: langData.ja.description
                }
            ];

            const payload = {
                ...item,
                name: langData.en.name || langData.vi.name,
                translations
            };

            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAlert({ type: 'success', message: t.alert_save_success || 'Collection saved successfully!' });

            setTimeout(() => {
                if (onSave) onSave(payload);
                if (refresh) refresh();
            }, 1000);

        } catch (error) {
            setAlert({ type: 'destructive', message: t.alert_save_error || 'Failed to save collection. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

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
                <div className="absolute top-4 left-6 right-6 z-50">
                    <ModalAlert
                        alert={alert}
                        onClose={() => setAlert({ type: null, message: null })}
                    />
                </div>

                {/* ━━ 1. Basic Information ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title={t.section_basic_info || "Basic Information"}
                        description={t.section_basic_info_desc || "Define the essential details for this collection."}
                    />
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                <Input
                                    variant="outlined"
                                    label={t.label_name || "Name"}
                                    placeholder={t.placeholder_name || "e.g. Signature Coffee"}
                                    position={lp}
                                    value={currentFields.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    disabled={isViewing}
                                />

                                <Input
                                    variant="outlined"
                                    label={t.label_shortName || "Short Name"}
                                    placeholder={t.placeholder_shortName || "e.g. SIG-COFFEE"}
                                    position={lp}
                                    value={currentFields.shortName}
                                    onChange={(e) => setField('shortName', e.target.value)}
                                    disabled={isViewing}
                                />
                                <Input
                                    variant="outlined"
                                    label={t.label_printerName || "Printer Name"}
                                    placeholder={t.placeholder_printerName || "e.g. Kitchen Printer 1"}
                                    position={lp}
                                    value={currentFields.printerName}
                                    onChange={(e) => setField('printerName', e.target.value)}
                                    disabled={isViewing}
                                />
                            </div>
                            <div
                                className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col h-[124px] lg:h-auto overflow-hidden"
                            >
                                <div
                                    className="flex-1 transition-colors duration-500 flex items-center justify-center p-4"
                                    style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                                >
                                    {/* Color Indicator Area */}
                                </div>
                                <ColorPicker
                                    value={selectedColor}
                                    onChange={setSelectedColor}
                                    triggerNode={
                                        <button
                                            className="w-full border-t border-outline-variant bg-white py-3 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                                            disabled={isViewing}
                                        >
                                            <Text size="body-small" className="font-bold text-primary text-transform-primary">{t.label_editColor || "Edit Color"}</Text>
                                        </button>
                                    }
                                />
                            </div>
                        </div>

                        <Textarea
                            label={t.label_description || "Description"}
                            placeholder={t.placeholder_description || "Provide a detailed description of this collection..."}
                            position={lp}
                            rows={4}
                            value={currentFields.description}
                            onChange={(e) => setField('description', e.target.value)}
                            disabled={isViewing}
                            className="bg-white"
                        />
                    </div>
                </section>

                {/* ━━ 2. Visual Identity ━━ */}
                <MediaUpload
                    title={t.section_visual_identity || "Visual Identity"}
                    description={t.section_visual_identity_desc || "Upload images and banners representing this collection."}
                    mediaFiles={mediaFiles}
                    onMediaFilesChange={(files) => setMediaFiles(files as any)}
                    primaryMediaIndex={mediaPrimaryIndex}
                    onPrimaryMediaIndexChange={setMediaPrimaryIndex}
                />

                {/* ━━ 3. Banner ━━ */}
                <MediaUpload
                    title={t.section_banner || "Banner"}
                    description={t.section_banner_desc || "Select a banner image for collection promotion."}
                    mediaFiles={bannerFiles}
                    onMediaFilesChange={(files) => setBannerFiles(files as any)}
                    primaryMediaIndex={bannerPrimaryIndex}
                    onPrimaryMediaIndexChange={setBannerPrimaryIndex}
                />

                {/* ━━ 4. Locations ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title={t.section_locations || "Locations"}
                        description={t.section_locations_desc || "Select locations where this collection will be available."}
                    />
                    <div className="space-y-4">
                        {selectedLocations.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedLocations.length} Locations</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedLocations.map(loc => loc.name).join(' • ')}
                                    </Text>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-primary font-bold hover:underline px-2 transition-all" disabled={isViewing}>{t.action_edit || "Edit"}</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                        <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                            <DialogTitle className="text-xl">{t.dialog_addLocation || "Add Location"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="border-b border-outline-variant bg-layer-04 flex justify-center gap-6 px-6 pt-3">
                                            <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Locations</button>
                                            <button className="pb-3 text-sm font-bold text-primary border-b-[3px] border-primary font-display">Location Groups</button>
                                        </div>
                                        <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fafafa]">
                                            <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-white shadow-sm">
                                                <Switch id="all-location-groups" />
                                                <label htmlFor="all-location-groups" className="text-[15px] font-bold cursor-pointer font-display text-on-surface">All Location Groups</label>
                                            </div>
                                            <div className="relative shadow-sm group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                                <input className="w-full pl-11 pr-4 h-12 rounded-xl border border-outline-variant bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-on-surface" placeholder="Search Location Group Name, ID" />
                                            </div>
                                            <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                                                <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                                                    <Checkbox id="select-all" />
                                                    <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                                        <span>ID</span>
                                                        <span>Name</span>
                                                    </div>
                                                    <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">{selectedLocations.length} Selected</div>
                                                </div>
                                                <div className="divide-y divide-outline-variant">
                                                    {[
                                                        { id: 1, count: 100 },
                                                        { id: 2, count: 54 },
                                                        { id: 3, count: 3 },
                                                        { id: 4, count: 19 },
                                                        { id: 5, count: 321 },
                                                        { id: 6, count: 12 }
                                                    ].map((group) => (
                                                        <label key={group.id} className="flex items-center gap-5 px-5 py-[14px] hover:bg-slate-50 transition-colors cursor-pointer group-row">
                                                            <Checkbox id={`group-${group.id}`} checked={selectedLocations.some(sl => sl.id === group.id)} />
                                                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 items-center">
                                                                <span className="text-[15px] font-bold text-on-surface font-display">{group.id}</span>
                                                                <div>
                                                                    <div className="text-[15px] font-bold text-on-surface font-display leading-tight">Group {group.id}</div>
                                                                    <div className="text-[13px] text-muted-foreground mt-1 font-body text-left">
                                                                        <span className="opacity-70 text-left">{group.count} locations</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </DialogBody>
                                        <DialogFooter className="px-6 py-4 border-t border-outline-variant bg-white">
                                            <div className="flex w-full justify-end">
                                                <DialogClose asChild>
                                                    <Button variant="primary" className="px-10 bg-primary hover:bg-primary/90 text-on-primary tracking-wide border-none rounded-xl h-11 w-full sm:w-auto text-[15px] font-bold shadow-md">Done</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </section>

                {/* ━━ 5. Items ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title={t.section_items || "Items"}
                        description={t.section_items_desc || "Assign products to this collection and manage their visibility."}
                    />
                    <div className="space-y-4">
                        {selectedItems.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedItems.length} Items</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedItems.map(item => item.name).join(' • ')}
                                    </Text>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-primary font-bold hover:underline px-2 transition-all" disabled={isViewing}>{t.action_edit || "Edit"}</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                        <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                            <DialogTitle className="text-xl">{t.dialog_addItem || "Add Item"}</DialogTitle>
                                        </DialogHeader>
                                        <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fafafa]">
                                            <div className="relative shadow-sm group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                                <input className="w-full pl-11 pr-4 h-12 rounded-xl border border-outline-variant bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-on-surface" placeholder="Search Item Name, ID" />
                                            </div>
                                            <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                                                <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                                                    <Checkbox id="select-all-items" />
                                                    <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                                        <span>ID</span>
                                                        <span>Name</span>
                                                    </div>
                                                    <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">{selectedItems.length} Selected</div>
                                                </div>
                                                <div className="divide-y divide-outline-variant">
                                                    {[
                                                        { id: 1, name: 'Tra sen vang', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop' },
                                                        { id: 2, name: 'Tra thanh dao' },
                                                        { id: 3, name: 'Tra thach dao' },
                                                        { id: 4, name: 'Tra thach vai' },
                                                        { id: 5, name: 'Tra dau do' },
                                                        { id: 6, name: 'Freeze tra xanh' },
                                                        { id: 7, name: 'Freeze socola' },
                                                        { id: 8, name: 'Phin sua da' },
                                                    ].map((item) => (
                                                        <label key={item.id} className="flex items-center gap-5 px-5 py-[14px] hover:bg-slate-50 transition-colors cursor-pointer group-row">
                                                            <Checkbox id={`item-${item.id}`} checked={selectedItems.some(si => si.id === item.id)} />
                                                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 items-center">
                                                                <span className="text-[15px] font-bold text-on-surface font-display">{item.id}</span>
                                                                <div className="flex items-center gap-4">
                                                                    {'img' in item ? (
                                                                        <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                                            {item.name.substring(0, 2).toUpperCase()}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-[15px] font-bold text-on-surface font-display leading-tight">{item.name}</div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </DialogBody>
                                        <DialogFooter className="px-6 py-4 border-t border-outline-variant bg-white">
                                            <div className="flex w-full justify-end">
                                                <DialogClose asChild>
                                                    <Button variant="primary" className="px-10 bg-primary hover:bg-primary/90 text-on-primary tracking-wide border-none rounded-xl h-11 w-full sm:w-auto text-[15px] font-bold shadow-md">Done</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer Actions */}
            {!isViewing && (
                <div className="flex justify-end p-6 border-t border-outline-variant bg-white gap-3 sticky bottom-0 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
                        {t.btn_cancel || 'Cancel'}
                    </Button>
                    <Button
                        variant="primary"
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
