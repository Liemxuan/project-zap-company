'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/genesis/atoms/interactive/button';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { Textarea } from '@/genesis/atoms/interactive/textarea';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Text } from '@/genesis/atoms/typography/text';
import { useTheme } from '@/components/ThemeContext';
import { Tabs } from '@/genesis/atoms/interactive/Tabs';
import { ColorPicker } from '@/genesis/organisms/media-upload';
import { AddLocation } from '@/genesis/organisms/add-location';
import { AddItems } from '@/genesis/organisms/add-items';
import { GripVertical, MoreHorizontal, Image as ImageIcon, Copy, Edit3, Trash2, ChevronDown, Plus, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/genesis/atoms/interactive/switch';
import { SelectField, SelectItem } from '@/genesis/atoms/interactive/select';
import { MultiSelect } from '@/genesis/atoms/interactive/multi-select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/genesis/molecules/dropdown-menu';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'ja', label: '日本語' },
] as const;

export interface ModifierItem {
    id: string;
    name: string;
    price: string | number;
    isActive: boolean;
}

interface ModifierGroupState {
    name: string;
    displayName: string;
    description: string;
    displayType: string;
    referenceId: string;
    referenceId2: string;
    channels: string[];
    minSelection: string;
    maxSelection: string;
    items: ModifierItem[];
}

const CHANNELS = [
    { label: 'POS', value: 'pos' },
    { label: 'App', value: 'app' },
    { label: 'web', value: 'web' },
    { label: 'Kisok', value: 'kiosk' },
];

const ALL_ITEMS = [
    { id: 1, name: 'Tra sen vang 1', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop', price: '10000' },
    { id: 2, name: 'Tra thanh dao 1', price: '10000' },
    { id: 3, name: 'Tra thach dao 1', price: '10000' },
    { id: 4, name: 'Tra thach vai 1', price: '10000' },
    { id: 5, name: 'Tra dau do 1', price: '10000' },
    { id: 6, name: 'Freeze tra xanh 1', price: '10000' },
    { id: 7, name: 'Freeze socola 1' },
    { id: 8, name: 'Phin sua da 1' },
];

function SectionHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <Heading level={4} className="text-on-surface font-bold text-transform-primary">{title}</Heading>
                {description && (
                    <Text size='body-small' className="text-muted-foreground">{description}</Text>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// ─── Local Component: Sortable Item ──────────────────────────────────────────

function SortableModifierRow({
    item,
    onRemove,
    onDuplicate,
    onUpdate,
    disabled
}: {
    item: ModifierItem;
    onRemove: (id: string) => void;
    onDuplicate: (item: ModifierItem) => void;
    onUpdate: (id: string, updates: Partial<ModifierItem>) => void;
    disabled?: boolean;
    activeLang?: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "grid grid-cols-[48px_60px_1fr_120px_48px] gap-4 px-4 py-4 items-center group hover:bg-slate-50 transition-colors bg-white",
                isDragging && "opacity-50 z-50 relative shadow-lg"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "flex items-center justify-center text-muted-foreground/30 group-hover:text-muted-foreground/60 touch-none",
                    disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"
                )}
            >
                <GripVertical size={20} />
            </div>

            <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/10 text-muted-foreground/30">
                    <ImageIcon size={24} strokeWidth={1.5} />
                </div>
            </div>

            <div className="flex flex-col">
                <Text size="body-medium" className="font-medium text-on-surface">
                    {item.name || "Unnamed Item"}
                </Text>
            </div>

            <div className="text-right">
                <Text size="body-medium" className="font-medium text-on-surface">
                    {item.price ? Number(item.price).toLocaleString() : '0'}
                </Text>
            </div>

            <div className="flex justify-end pr-2">
                {!disabled && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 text-primary transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => console.log('Edit item', item.id)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(item)}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onRemove(item.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

// ─── Local Component: Modifier Items Editor ──────────────────────────────────

function ModifierItemEditor({ items, onChange, disabled, activeLang = 'en' }: { items: ModifierItem[]; onChange: (items: ModifierItem[]) => void; disabled?: boolean; activeLang?: string }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (disabled) return;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            onChange(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <div className="space-y-4">
            <div className="border border-outline-variant bg-white overflow-hidden shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-[48px_60px_1fr_120px_48px] gap-4 px-4 py-3 bg-[#f6f6f6] border-b border-outline-variant">
                    <div />
                    <div />
                    <Text size="label-medium" className="font-bold text-on-surface self-center uppercase tracking-widest">Name</Text>
                    <Text size="label-medium" className="font-bold text-on-surface self-center text-right uppercase tracking-widest">Price</Text>
                    <div />
                </div>

                {/* Items List */}
                <div className="bg-white">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((i) => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <AnimatePresence initial={false}>
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <Text className="text-muted-foreground italic">No modifier items added yet.</Text>
                                    </motion.div>
                                ) : (
                                    items.map((item) => (
                                        <SortableModifierRow
                                            key={item.id}
                                            item={item}
                                            disabled={disabled}
                                            onRemove={(id) => onChange(items.filter(i => i.id !== id))}
                                            onDuplicate={(it) => {
                                                const newItem = { ...it, id: Math.random().toString(36).substring(2, 9) };
                                                onChange([...items, newItem]);
                                            }}
                                            onUpdate={(id, updates) => onChange(items.map(i => i.id === id ? { ...i, ...updates } : i))}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface ModifierGroupDetailProps {
    mode?: 'create' | 'edit' | 'view';
    item?: any | null;
    onCancel?: () => void;
    onSave?: (data: any) => void;
    t: any;
    refresh?: () => void;
}

export default function ModifierGroupDetail({
    mode = 'create',
    item,
    onCancel,
    onSave,
    t,
    refresh
}: ModifierGroupDetailProps) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const isViewing = mode === 'view';
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['id']>('en');
    const [isSaving, setIsSaving] = useState(false);

    const [langData, setLangData] = useState<Record<string, ModifierGroupState>>(() => {
        const initial: Record<string, ModifierGroupState> = {
            en: { name: '', displayName: '', description: '', displayType: 'list', referenceId: '', referenceId2: '', channels: ['pos', 'app', 'web', 'kiosk'], minSelection: '0', maxSelection: '1', items: [] },
            vi: { name: '', displayName: '', description: '', displayType: 'list', referenceId: '', referenceId2: '', channels: ['pos', 'app', 'web', 'kiosk'], minSelection: '0', maxSelection: '1', items: [] },
            ja: { name: '', displayName: '', description: '', displayType: 'list', referenceId: '', referenceId2: '', channels: ['pos', 'app', 'web', 'kiosk'], minSelection: '0', maxSelection: '1', items: [] },
        };

        if (item) {
            const getLangFields = (localeId: number | string) => {
                const trans = item.translations?.find((tr: any) => tr.locale_id === localeId || tr.language_code === localeId);
                return {
                    name: trans?.name || item.name || '',
                    displayName: trans?.display_name || item.display_name || '',
                    description: trans?.description || item.description || '',
                };
            };

            const common = {
                displayType: item.display_type || 'list',
                referenceId: item.reference_id || '',
                referenceId2: item.reference_id_2 || '',
                channels: item.channels || ['pos', 'app', 'web', 'kiosk'],
                minSelection: item.min_selection?.toString() || '0',
                maxSelection: item.max_selection?.toString() || '1',
                items: item.modifier_items?.map((mi: any) => ({
                    id: mi.id?.toString() || Math.random().toString(36).substring(7),
                    name: mi.name || '',
                    price: mi.price || 0,
                    isActive: mi.is_active !== false
                })) || []
            };

            initial.en = { ...initial.en, ...getLangFields('en'), ...common };
            initial.vi = { ...initial.vi, ...getLangFields('vi'), ...common };
            initial.ja = { ...initial.ja, ...getLangFields('ja'), ...common };
        }

        return initial;
    });

    const [selectedColor, setSelectedColor] = useState(item?.color || 'var(--color-primary)');
    const [selectedLocations, setSelectedLocations] = useState(item?.locations || [
        { id: 'all', name: 'All locations' }
    ]);

    const currentData = langData[activeLang];

    const updateData = (updates: Partial<ModifierGroupState>) => {
        if (isViewing) return;
        setLangData(prev => ({
            ...prev,
            [activeLang]: { ...prev[activeLang], ...updates }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSave?.(langData);
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-auto bg-layer-canvas">
                {/* Language tabs — sticky below header */}
                <div className="sticky top-0 z-50 flex justify-center border-b border-outline-variant bg-white px-6">
                    <Tabs
                        tabs={LANGUAGES as any}
                        activeTab={activeLang}
                        onChange={(id) => setActiveLang(id as typeof LANGUAGES[number]['id'])}
                        className="border-none pb-0"
                    />
                </div>

                <div className="w-full max-w-5xl mx-auto space-y-12 py-10 px-8 pb-32">
                    {/* ━━ 1. Basic Information ━━ */}
                    <section className="space-y-8">
                        <SectionHeading title={t.section_basicInfo || "Basic information"} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                            <div className="lg:col-span-2 space-y-6">
                                <Input
                                    variant="outlined"
                                    label={t.label_name || "Name"}
                                    placeholder={t.label_name || "Name"}
                                    position={lp}
                                    value={currentData.name}
                                    onChange={(e) => updateData({ name: e.target.value })}
                                    disabled={isViewing}
                                />
                                <Input
                                    variant="outlined"
                                    label={t.label_displayName || "Display name"}
                                    placeholder={t.label_displayName || "Display name"}
                                    position={lp}
                                    value={currentData.displayName}
                                    onChange={(e) => updateData({ displayName: e.target.value })}
                                    disabled={isViewing}
                                />
                                <Textarea
                                    label={t.label_description || "Description"}
                                    placeholder={t.label_description || "Description"}
                                    position={lp}
                                    rows={4}
                                    value={currentData.description}
                                    onChange={(e) => updateData({ description: e.target.value })}
                                    className="bg-white"
                                    disabled={isViewing}
                                />

                                <SelectField
                                    label={t.label_displayType || "Display type"}
                                    position={lp}
                                    value={currentData.displayType}
                                    onValueChange={(val) => updateData({ displayType: val })}
                                    triggerClassName="bg-white"
                                    disabled={isViewing}
                                >
                                    <SelectItem value="list">List</SelectItem>
                                    <SelectItem value="grid">Grid</SelectItem>
                                    <SelectItem value="carousel">Carousel</SelectItem>
                                </SelectField>
                            </div>

                            <div className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col min-h-[140px] bg-surface-variant/10 self-start">
                                <div
                                    className="flex-1 rounded-t-xl transition-colors duration-500 flex items-center justify-center p-4 min-h-[220px]"
                                    style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                                />
                                {!isViewing && (
                                    <ColorPicker
                                        value={selectedColor}
                                        onChange={setSelectedColor}
                                        triggerNode={
                                            <button className="w-full border-t border-outline-variant bg-white py-4 text-center cursor-pointer hover:bg-slate-50 transition-colors rounded-b-xl">
                                                <Text size="body-small" className="font-bold text-primary text-transform-primary">{t.label_editColor || "Edit Color"}</Text>
                                            </button>
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                variant="outlined"
                                label={t.label_referenceId || "Reference ID"}
                                placeholder={t.label_referenceId || "Reference ID"}
                                position={lp}
                                value={currentData.referenceId}
                                onChange={(e) => updateData({ referenceId: e.target.value })}
                                disabled={isViewing}
                            />
                            <Input
                                variant="outlined"
                                label={t.label_referenceId2 || "Reference ID 2"}
                                placeholder={t.label_referenceId2 || "Reference ID 2"}
                                position={lp}
                                value={currentData.referenceId2}
                                onChange={(e) => updateData({ referenceId2: e.target.value })}
                                disabled={isViewing}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5 flex flex-col">
                                <div className="relative group w-full">
                                    <MultiSelect
                                        options={CHANNELS}
                                        selected={currentData.channels}
                                        onChange={(channels) => updateData({ channels })}
                                        className="min-h-[48px] pt-3.5 pb-0 bg-white border-outline-variant shadow-none"
                                        placeholder="Select channels..."
                                        disabled={isViewing}
                                    />
                                    <Text size="label-small" className="absolute left-3 top-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase pointer-events-none z-10">
                                        {t.label_channels || "Channel"}
                                    </Text>
                                </div>
                            </div>

                            <div className="space-y-1.5 flex flex-col">
                                <AddLocation
                                    selectedLocations={selectedLocations}
                                    onSelectionChange={setSelectedLocations}
                                    trigger={
                                        <div className={cn(
                                            "relative group w-full h-full cursor-pointer",
                                            isViewing && "pointer-events-none"
                                        )}>
                                            <div className="flex h-[48px] w-full items-center justify-between border border-outline-variant bg-white px-3 pb-1.5 pt-5 transition-all outline-none hover:border-primary/50">
                                                <Text className="text-primary font-medium text-sm">
                                                    {(selectedLocations.length === 0 || (selectedLocations.length === 1 && selectedLocations[0].id === 'all')) ? 'All locations' : `${selectedLocations.length} locations`}
                                                </Text>
                                                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                                            </div>
                                            <Text size="label-small" className="absolute left-3 top-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase pointer-events-none">
                                                {t.label_locations || "Location"}
                                            </Text>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* ━━ 2. Modifier items ━━ */}
                    <section className="space-y-8">
                        <SectionHeading
                            title={t.section_modifierItems || "Modifier items"}
                            action={!isViewing && (
                                <AddItems
                                    items={ALL_ITEMS}
                                    title={t.label_addModifierItem || 'Add modifier item'}
                                    selectedItems={currentData.items.map(item => ({ id: isNaN(Number(item.id)) ? item.id : Number(item.id), name: item.name, price: item.price }))}
                                    onSelectionChange={(selected) => {
                                        const newItems: ModifierItem[] = selected.map(item => {
                                            const existing = currentData.items.find(i => i.id === item.id.toString());
                                            if (existing) return existing;
                                            return {
                                                id: item.id.toString(),
                                                name: item.name,
                                                price: item.price || '0',
                                                isActive: true
                                            };
                                        });
                                        updateData({ items: newItems });
                                    }}
                                    trigger={
                                        <button className="text-primary font-bold text-sm tracking-wide mr-2 hover:underline">
                                            {t.action_addItems || "Add Items"}
                                        </button>
                                    }
                                />
                            )}
                        />

                        <div className="bg-white border border-outline-variant p-5 flex gap-4">
                            <Switch
                                checked={currentData.maxSelection === '1'}
                                onCheckedChange={(checked) => updateData({ maxSelection: checked ? '1' : '' })}
                                disabled={isViewing}
                            />
                            <div className="space-y-0.5">
                                <Text className="font-bold text-on-surface" size='body-medium'>{t.label_selectOneOnly || "Customer can only select one modifier"}</Text>
                                <Text size="body-small" className="text-muted-foreground">{t.label_defaultModifierHint || "The first modifier in your set will become the default"}</Text>
                            </div>
                        </div>

                        <ModifierItemEditor
                            items={currentData.items}
                            onChange={(items) => updateData({ items })}
                            disabled={isViewing}
                            activeLang={activeLang}
                        />
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
                        {isSaving ? (t.label_saving || 'Saving...') : (mode === 'create' ? (t.btn_create || 'Create') : (t.btn_save || 'Save'))}
                    </Button>
                </div>
            )}
        </div>
    );
}
