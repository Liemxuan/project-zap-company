import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, Image as ImageIcon, Pipette, Hash } from 'lucide-react';
import { Dropzone } from '../atoms/interactive/dropzone';
import { Popover, PopoverContent, PopoverTrigger } from '../molecules/popover';
import { Input } from '../atoms/interactive/inputs';
import { Text } from '../atoms/typography/text';
import { Heading } from '../atoms/typography/headings';

const PRESET_COLORS = [
    { name: 'Primary', value: 'var(--color-primary)' },
    { name: 'Secondary', value: 'var(--color-secondary)' },
    { name: 'Tertiary', value: 'var(--color-tertiary)' },
    { name: 'Error', value: 'var(--color-error)' },
    { name: 'Success', value: '#10b981' },
    { name: 'Warning', value: '#f59e0b' },
    { name: 'Info', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cocoa', value: '#78350f' },
];

export function ColorPicker({ value, onChange, triggerNode }: { value: string; onChange: (color: string) => void; triggerNode?: React.ReactNode }) {
    const isHex = value.startsWith('#');
    const displayValue = isHex ? value : '#6366f1';

    return (
        <Popover>
            <PopoverTrigger asChild>
                {triggerNode || (
                    <button
                        className={[
                            "h-10 w-10 rounded-full border-4 transition-all duration-300 relative flex items-center justify-center group overflow-hidden bg-slate-100",
                            isHex ? "border-primary scale-110 shadow-lg" : "border-outline-variant hover:border-primary/40"
                        ].join(' ')}
                        style={{ backgroundColor: displayValue }}
                        title="Custom Color"
                    >
                        <Pipette size={14} className={isHex ? "text-white" : "text-muted-foreground group-hover:text-primary"} />
                        {isHex && <div className="absolute inset-0 bg-black/10" />}
                    </button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 space-y-4" align="start">
                <div className="space-y-2">
                    <Text size="body-small" className="font-bold uppercase tracking-widest text-muted-foreground">Custom Color</Text>
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl border border-outline-variant overflow-hidden shrink-0 shadow-inner">
                            <input
                                type="color"
                                value={displayValue}
                                onChange={(e) => onChange(e.target.value)}
                                className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer"
                            />
                        </div>
                        <Input
                            //prefix={<Hash size={14} />}
                            value={displayValue.replace('#', '')}
                            onChange={(e) => onChange(`#${e.target.value}`)}
                            className="font-dev uppercase"
                            variant="filled"
                            maxLength={6}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-2 pt-2">
                    {['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#71717a', '#444444', '#000000'].map(c => (
                        <button
                            key={c}
                            onClick={() => onChange(c)}
                            className="h-6 w-6 rounded-md hover:scale-110 transition-transform shadow-sm border border-black/5"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function SelectableCard({
    image,
    label,
    onRemove,
    isSelected,
    onSelect,
    className
}: {
    image?: string;
    label?: string;
    onRemove: () => void;
    isSelected?: boolean;
    onSelect?: () => void;
    className?: string;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={[
                "relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                isSelected ? "border-primary shadow-md" : "border-outline-variant/30 hover:border-primary/40",
                className
            ].join(' ')}
            onClick={onSelect}
        >
            <div className="absolute inset-0 bg-surface-container flex items-center justify-center overflow-hidden">
                {image ? (
                    <img src={image} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <ImageIcon className="text-muted-foreground/30" size={32} />
                )}
            </div>
            {label && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                    <Text size="body-small" className="text-white font-medium truncate">{label}</Text>
                </div>
            )}
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm z-10"
            >
                <X size={14} />
            </button>
            {onSelect && (
                <div
                    className={[
                        "absolute right-2 bottom-2 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                            ? "bg-primary border-primary text-on-primary scale-110"
                            : "bg-black/20 border-white/50 text-transparent group-hover:bg-black/40"
                    ].join(' ')}
                >
                    <Check size={12} strokeWidth={4} />
                </div>
            )}
        </motion.div>
    );
}

export interface MediaUploadProps {
    title?: string;
    description?: string;
    mediaFiles: File[];
    onMediaFilesChange: (files: File[]) => void;
    primaryMediaIndex: number | null;
    onPrimaryMediaIndexChange: (index: number | null) => void;
    uploadLabel?: string;
    uploadActionLabel?: string;
    supportText?: string;
}

export function MediaUpload({
    title = "Media Upload",
    description = "Upload the primary brand logo and media.",
    mediaFiles,
    onMediaFilesChange,
    primaryMediaIndex,
    onPrimaryMediaIndexChange,
    uploadLabel = "Drag image here or",
    uploadActionLabel = "Upload",
    supportText = "Support: PNG, JPG. Maximum file size: 2MB. Recommended: 1000 \u00d7 1000 or a 1:1 aspect ratio."
}: MediaUploadProps) {
    const mediaPreviews = useMemo(() => {
        return mediaFiles.map(file => URL.createObjectURL(file));
    }, [mediaFiles]);

    return (
        <section className="space-y-6">
            <div className="space-y-1">
                {title && <Heading level={4}>{title}</Heading>}
                {description && <Text size="body-small" className="text-muted-foreground">{description}</Text>}
            </div>


            <div className="space-y-4">
                <Dropzone
                    value={mediaFiles}
                    onChange={(newFiles) => {
                        onMediaFilesChange(newFiles);
                        if (primaryMediaIndex === null && newFiles.length > 0) onPrimaryMediaIndexChange(0);
                    }}
                    hideFileList={true}
                    className="w-full bg-layer-canvas/30 border border-outline-variant hover:border-primary/50 rounded-xl transition-all flex items-center justify-start"
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'] }}
                >
                    <div className="flex items-center justify-start gap-2">
                        <ImageIcon size={48} className="text-on-surface/80 shrink-0" strokeWidth={1.2} />
                        <div className="flex flex-col">
                            <Text size="body-medium" className="text-on-surface text-left">
                                {uploadLabel} <span className="font-bold text-primary cursor-pointer hover:underline">{uploadActionLabel}</span>.
                            </Text>
                            <Text size="body-small" className="text-muted-foreground text-left">
                                {supportText}
                            </Text>
                        </div>
                    </div>
                </Dropzone>

                {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        <AnimatePresence mode="popLayout">
                            {mediaFiles.map((file, idx) => (
                                <SelectableCard
                                    key={`${file.name}-${idx}`}
                                    image={mediaPreviews[idx]}
                                    label={file.name}
                                    isSelected={primaryMediaIndex === idx}
                                    onSelect={() => onPrimaryMediaIndexChange(idx)}
                                    onRemove={() => {
                                        const updated = mediaFiles.filter((_, i) => i !== idx);
                                        onMediaFilesChange(updated);
                                        if (primaryMediaIndex === idx) onPrimaryMediaIndexChange(updated.length > 0 ? 0 : null);
                                        else if (primaryMediaIndex !== null && primaryMediaIndex > idx) onPrimaryMediaIndexChange(primaryMediaIndex - 1);
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

        </section>
    );
}
