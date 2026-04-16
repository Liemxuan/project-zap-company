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
import { MultiSelect, MultiSelectOption } from '../../atoms/interactive/multi-select';
import { Dropzone } from '../../atoms/interactive/dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '../../molecules/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogTrigger, DialogFooter, DialogClose } from '../../molecules/dialog';
import { Switch } from '../../atoms/interactive/switch';
import { Checkbox } from '../../atoms/interactive/checkbox';
import { Tabs } from '../../atoms/interactive/Tabs';
import { MediaUpload, SelectableCard, ColorPicker } from '../../organisms/media-upload';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../molecules/pagination';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '../../molecules/alert';

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

    const [alert, setAlert] = useState<{ type: 'success' | 'destructive' | null; message: string | null; subMessage?: string }>({
        type: 'success',
        message: 'Group settings updated successfully',
        subMessage: 'Your changes have been saved and are now live across all locations.'
    });



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
                <AnimatePresence>
                    {alert.type && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Alert
                                variant={alert.type}
                                close
                                onClose={() => setAlert({ type: null, message: null })}
                                className="shadow-sm border-outline-variant/50"
                            >
                                <AlertIcon>
                                    {alert.type === 'success' ? <CircleCheck className="size-5" /> : <CircleAlert className="size-5" />}
                                </AlertIcon>
                                <AlertContent>
                                    <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                                    <AlertDescription>{alert.message}</AlertDescription>
                                    {alert.subMessage && (
                                        <Text size="body-small" className="mt-1 opacity-70 italic">{alert.subMessage}</Text>
                                    )}
                                </AlertContent>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
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

                {/* ━━ 2. Media ━━ */}
                <MediaUpload
                    title="Media"
                    description=""
                    mediaFiles={mediaFiles}
                    onMediaFilesChange={setMediaFiles}
                    primaryMediaIndex={mediaPrimaryIndex}
                    onPrimaryMediaIndexChange={setMediaPrimaryIndex}
                />
                {/* ━━ 3. Banner ━━ */}
                <MediaUpload
                    title="Banner"
                    description=""
                    mediaFiles={bannerFiles}
                    onMediaFilesChange={setBannerFiles}
                    primaryMediaIndex={bannerPrimaryIndex}
                    onPrimaryMediaIndexChange={setBannerPrimaryIndex}
                />
                {/* ━━ 4. Locations ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Locations"
                    />
                    <div className="space-y-4">
                        {selectedLocations.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-white border border-outline-variant rounded-xl shadow-sm">
                                <div className="space-y-1">
                                    <Text className="font-bold text-on-surface">{selectedLocations.length} Locations</Text>
                                    <Text size="body-small" className="text-muted-foreground line-clamp-1">
                                        {selectedLocations.map(loc => loc.name).join(' \u2022 ')}
                                    </Text>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-primary font-bold hover:underline px-2 transition-all">Edit</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                        <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                            <DialogTitle className="text-xl">Add Location</DialogTitle>
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
                                            <Pagination className="pt-2 pb-4">
                                                <PaginationContent>
                                                    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                                                    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                                                    <PaginationItem><PaginationNext href="#" /></PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
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

                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="w-full h-14 bg-surface-container rounded-xl flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
                                    <Text className="font-bold text-primary">Add Locations</Text>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                    <DialogTitle className="text-xl">Add Location</DialogTitle>
                                </DialogHeader>
                                <div className="border-b border-outline-variant bg-layer-04 flex justify-center gap-6 px-6 pt-3">
                                    <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Locations</button>
                                    <button className="pb-3 text-sm font-bold text-primary border-b-[3px] border-primary font-display">Location Groups</button>
                                </div>
                                <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fafafa]">
                                    <div className="flex items-center gap-4 p-4 border border-outline-variant rounded-xl bg-white shadow-sm">
                                        <Switch id="all-location-groups-2" />
                                        <label htmlFor="all-location-groups-2" className="text-[15px] font-bold cursor-pointer font-display text-on-surface">All Location Groups</label>
                                    </div>
                                    <div className="relative shadow-sm group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                        <input className="w-full pl-11 pr-4 h-12 rounded-xl border border-outline-variant bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-on-surface" placeholder="Search Location Group Name, ID" />
                                    </div>
                                    <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                                        <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                                            <Checkbox id="select-all-2" />
                                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                                <span>ID</span>
                                                <span>Name</span>
                                            </div>
                                            <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">0 Selected</div>
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
                                                    <Checkbox id={`group-2-${group.id}`} />
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
                                    <Pagination className="pt-2 pb-4">
                                        <PaginationContent>
                                            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                                            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationNext href="#" /></PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
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
                </section>
                {/* ━━ 5. Items ━━ */}
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
                                    </Text>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-primary font-bold hover:underline px-2 transition-all">Edit</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                        <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                            <DialogTitle className="text-xl">Add Item</DialogTitle>
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
                                                                    <div>
                                                                        <div className="text-[15px] font-bold text-on-surface font-display leading-tight">{item.name}</div>
                                                                        <div className="text-[13px] text-muted-foreground mt-1 font-body text-left">
                                                                            <span className="opacity-70 text-left">3 variations</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <Pagination className="pt-2 pb-4">
                                                <PaginationContent>
                                                    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                                                    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                                                    <PaginationItem><PaginationNext href="#" /></PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
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

                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="w-full h-14 bg-surface-container rounded-xl flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
                                    <Text className="font-bold text-primary">Add Items</Text>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                                <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                                    <DialogTitle className="text-xl">Add Item</DialogTitle>
                                </DialogHeader>
                                <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fafafa]">
                                    <div className="relative shadow-sm group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                        <input className="w-full pl-11 pr-4 h-12 rounded-xl border border-outline-variant bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-on-surface" placeholder="Search Item Name, ID" />
                                    </div>
                                    <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                                        <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                                            <Checkbox id="select-all-items-2" />
                                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                                <span>ID</span>
                                                <span>Name</span>
                                            </div>
                                            <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">0 Selected</div>
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
                                                    <Checkbox id={`item-2-${item.id}`} />
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
                                                            <div>
                                                                <div className="text-[15px] font-bold text-on-surface font-display leading-tight">{item.name}</div>
                                                                <div className="text-[13px] text-muted-foreground mt-1 font-body text-left">
                                                                    <span className="opacity-70 text-left">3 variations</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <Pagination className="pt-2 pb-4">
                                        <PaginationContent>
                                            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                                            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                                            <PaginationItem><PaginationNext href="#" /></PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
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
                </section>
            </div>
        </div>
    );
}
