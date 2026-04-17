'use client';

import { useState } from 'react';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/inputs';
import { Textarea } from '../../atoms/interactive/textarea';
import { Heading } from '../../atoms/typography/headings';
import { Text } from '../../atoms/typography/text';
import { useTheme } from '../../../components/ThemeContext';
import { Tabs } from '../../atoms/interactive/Tabs';
import { ColorPicker } from '../../organisms/media-upload';
import { AddLocation } from '../../organisms/add-location';
import { AddItems } from '../../organisms/add-items';
import { X, Plus, GripVertical, DollarSign, ChevronDown, MoreHorizontal, Image as ImageIcon, Copy, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '../../atoms/interactive/switch';
import { SelectField, SelectItem } from '../../atoms/interactive/select';
import { MultiSelect } from '../../atoms/interactive/multi-select';
import { Badge } from '../../atoms/interactive/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../molecules/dropdown-menu';
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
import { cn } from '../../../lib/utils';

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

function SectionHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <Heading level={4} className="text-on-surface">{title}</Heading>
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
    onUpdate
}: {
    item: ModifierItem;
    onRemove: (id: string) => void;
    onDuplicate: (item: ModifierItem) => void;
    onUpdate: (id: string, updates: Partial<ModifierItem>) => void;
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
                className="flex items-center justify-center text-muted-foreground/30 group-hover:text-muted-foreground/60 cursor-grab active:cursor-grabbing touch-none"
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
            </div>
        </div>
    );
}

// ─── Local Component: Modifier Items Editor ──────────────────────────────────

function ModifierItemEditor({ items, onChange }: { items: ModifierItem[]; onChange: (items: ModifierItem[]) => void }) {
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
                    <Text size="label-medium" className="font-bold text-on-surface self-center">Name</Text>
                    <Text size="label-medium" className="font-bold text-on-surface self-center text-right">Price</Text>
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

            <AddItems
                items={ALL_ITEMS}
                selectedItems={items.map(item => ({ id: isNaN(Number(item.id)) ? item.id : Number(item.id), name: item.name, price: item.price }))}
                onSelectionChange={(selected) => {
                    const newItems: ModifierItem[] = selected.map(item => {
                        const existing = items.find(i => i.id === item.id.toString());
                        if (existing) return existing;
                        return {
                            id: item.id.toString(),
                            name: item.name,
                            price: item.price || '0',
                            isActive: true
                        };
                    });
                    onChange(newItems);
                }}
                trigger=""
            />
        </div>
    );
}

// ─── Main Template ──────────────────────────────────────────────────────────
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
export default function ModifierGroupCreateTemplate({ onCancel, onSave }: { onCancel?: () => void; onSave?: (data: any) => void }) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<typeof LANGUAGES[number]['id']>('en');

    const [langData, setLangData] = useState<Record<string, ModifierGroupState>>({
        en: {
            name: '',
            displayName: '',
            description: '',
            displayType: 'list',
            referenceId: '',
            referenceId2: '',
            channels: ['pos', 'app', 'web', 'kiosk'],
            minSelection: '0',
            maxSelection: '1',
            items: []
        },
        vi: {
            name: '',
            displayName: '',
            description: '',
            displayType: 'list',
            referenceId: '',
            referenceId2: '',
            channels: ['pos', 'app', 'web', 'kiosk'],
            minSelection: '0',
            maxSelection: '1',
            items: []
        },
        ja: {
            name: '',
            displayName: '',
            description: '',
            displayType: 'list',
            referenceId: '',
            referenceId2: '',
            channels: ['pos', 'app', 'web', 'kiosk'],
            minSelection: '0',
            maxSelection: '1',
            items: []
        },
    });

    const [selectedColor, setSelectedColor] = useState('var(--color-primary)');
    const [selectedLocations, setSelectedLocations] = useState([
        { id: 'all', name: 'All locations' }
    ]);

    const currentData = langData[activeLang];

    const updateData = (updates: Partial<ModifierGroupState>) => {
        setLangData(prev => ({
            ...prev,
            [activeLang]: { ...prev[activeLang], ...updates }
        }));
    };

    return (
        <div className="flex-1 overflow-auto bg-layer-canvas bg-white">
            {/* Language tabs — sticky below header */}
            <div className="sticky top-0 z-100 flex justify-center border-b border-outline-variant bg-background -mx-6 md:-mx-10 px-6 md:px-10">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={(id) => setActiveLang(id as typeof LANGUAGES[number]['id'])}
                    className="border-none pb-0"
                />
            </div>

            <div className="w-full max-w-5xl mx-auto space-y-8 py-10 px-6">
                {/* ━━ 1. Basic Information ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Basic information"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        <div className="lg:col-span-2 space-y-4">
                            <Input
                                variant="outlined"
                                label="Name"
                                placeholder="Name"
                                position={lp}
                                value={currentData.name}
                                onChange={(e) => updateData({ name: e.target.value })}
                            />
                            <Input
                                variant="outlined"
                                label="Display name"
                                placeholder="Display name"
                                position={lp}
                                value={currentData.displayName}
                                onChange={(e) => updateData({ displayName: e.target.value })}
                            />
                            <Textarea
                                label="Description"
                                placeholder="Description"
                                position={lp}
                                rows={4}
                                value={currentData.description}
                                onChange={(e) => updateData({ description: e.target.value })}
                                className="bg-white"
                            />

                            <SelectField
                                label="Display type"
                                position={lp}
                                value={currentData.displayType}
                                onValueChange={(val) => updateData({ displayType: val })}
                                triggerClassName="bg-white"
                            >
                                <SelectItem value="list">List</SelectItem>
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="carousel">Carousel</SelectItem>
                            </SelectField>

                        </div>
                        <div className="lg:col-span-1 border border-outline-variant rounded-xl flex flex-col min-h-[140px] bg-surface-variant/10 self-start mt-0">
                            <div
                                className="flex-1 rounded-t-xl transition-colors duration-500 flex items-center justify-center p-4 min-h-[220px]"
                                style={{ backgroundColor: selectedColor || 'var(--surface-variant)' }}
                            >
                                {/* Image Placeholder Placeholder */}
                            </div>
                            <ColorPicker
                                value={selectedColor}
                                onChange={setSelectedColor}
                                triggerNode={
                                    <button className="w-full border-t border-outline-variant bg-white py-4 text-center cursor-pointer hover:bg-slate-50 transition-colors rounded-b-xl">
                                        <Text size="body-small" className="font-bold text-primary text-transform-primary">Edit</Text>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            variant="outlined"
                            label="Reference ID"
                            placeholder="Reference ID"
                            position={lp}
                            value={currentData.referenceId}
                            onChange={(e) => updateData({ referenceId: e.target.value })}
                        />
                        <Input
                            variant="outlined"
                            label="Reference ID 2"
                            placeholder="Reference ID 2"
                            position={lp}
                            value={currentData.referenceId2}
                            onChange={(e) => updateData({ referenceId2: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Channel Field */}
                        <div className="space-y-1.5 flex flex-col">
                            <div className="relative group w-full">
                                <MultiSelect
                                    options={CHANNELS}
                                    selected={currentData.channels}
                                    onChange={(channels) => updateData({ channels })}
                                    className="min-h-[48px] pt-3.5 pb-0 bg-white border-outline-variant shadow-none"
                                    placeholder="Select channels..."
                                />
                                <Text size="label-small" className="absolute left-3 top-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase pointer-events-none z-10">
                                    Channel
                                </Text>
                            </div>
                        </div>

                        {/* Location Field */}
                        <div className="space-y-1.5 flex flex-col">
                            <AddLocation
                                selectedLocations={selectedLocations}
                                onSelectionChange={setSelectedLocations as any}
                                trigger={
                                    <div className="relative group w-full h-full cursor-pointer">
                                        <div className="flex h-[48px] w-full items-center justify-between border border-outline-variant bg-white px-3 pb-1.5 pt-5 transition-all outline-none hover:border-primary/50">
                                            <Text className="text-primary font-medium text-sm">
                                                {(selectedLocations.length === 0 || (selectedLocations.length === 1 && selectedLocations[0].id === 'all')) ? 'All locations' : `${selectedLocations.length} locations`}
                                            </Text>
                                            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                                        </div>
                                        <Text size="label-small" className="absolute left-3 top-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase pointer-events-none">
                                            Location
                                        </Text>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* ━━ 2. Modifier item ━━ */}
                <section className="space-y-6">
                    <SectionHeading
                        title="Modifier item"
                        action={
                            <AddItems
                                items={ALL_ITEMS}
                                title='Add modifier item'
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
                                        Add Items
                                    </button>
                                }
                            />
                        }
                    />

                    <div className="bg-white border border-outline-variant p-5 flex gap-4">
                        <Switch
                            checked={currentData.maxSelection === '1'}
                            onCheckedChange={(checked) => updateData({ maxSelection: checked ? '1' : '' })}
                        />
                        <div className="space-y-0.5">
                            <Text className="font-bold text-on-surface" size='body-medium'>Customer can only select one modifier</Text>
                            <Text size="body-small" className="text-muted-foreground">The first modifier in your set will become the default</Text>
                        </div>
                    </div>

                    <ModifierItemEditor
                        items={currentData.items}
                        onChange={(items) => updateData({ items })}
                    />
                </section>

            </div>
        </div>
    );
}


