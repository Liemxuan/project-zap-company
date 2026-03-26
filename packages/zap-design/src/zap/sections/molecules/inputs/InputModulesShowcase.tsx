'use client';

import React, { useState } from 'react';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Heading } from '../../../../genesis/atoms/typography/headings';
import { Text } from '../../../../genesis/atoms/typography/text';
import { Input } from '../../../../genesis/atoms/interactive/inputs';
import { EmailInput } from '../../../../genesis/atoms/interactive/EmailInput';
import { SearchInput } from '../../../../genesis/atoms/interactive/SearchInput';
import { PasswordInput } from '../../../../genesis/atoms/interactive/PasswordInput';
import { CreditCardInput } from '../../../../genesis/atoms/formatters/credit-card';
import { CurrencyInput } from '../../../../genesis/atoms/formatters/currency';
import { PhoneNumberInput } from '../../../../genesis/atoms/formatters/phone';
import { DatePickerWithRange } from '../../../../genesis/atoms/interactive/date-range-picker';
import { MultiSelect } from '../../../../genesis/atoms/interactive/multi-select';
import { TagInput } from '../../../../genesis/atoms/interactive/tag-input';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '../../../../genesis/atoms/interactive/input-otp';

import { CanvasBody } from '../../../../zap/layout/CanvasBody';
import { DatePicker } from '../../../../genesis/atoms/interactive/date-picker';
import { TimePicker } from '../../../../genesis/atoms/interactive/time-picker';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../genesis/molecules/form'
import { Button } from '../../../../genesis/atoms/interactive/button'
import {
  Check,
  ChevronUp,
  LayoutGrid,
  List as ListIcon,
  Filter,
  Search as SearchIcon,
  Plus
} from "lucide-react"
import { cn } from '../../../../lib/utils'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../../../genesis/atoms/interactive/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../genesis/molecules/popover'

const serviceItems = [
  { value: "web-dev", label: "Web Development", category: "Dev" },
  { value: "mobile-design", label: "Mobile App Design", category: "Design" },
  { value: "cloud-hosting", label: "Cloud Hosting", category: "Dev" },
  { value: "digital-marketing", label: "Digital Marketing", category: "Marketing" },
];

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

// ─── TYPES ──────────────────────────────────────────────────────────────────────

interface InputModulesShowcaseProps {
    cssVars?: React.CSSProperties;
}

// ─── SHOWCASE ───────────────────────────────────────────────────────────────────

export const InputModulesShowcase = ({ cssVars }: InputModulesShowcaseProps) => {
    // ── Email States ────────────────────────────────────────────────
    const [focusedEmail, setFocusedEmail] = useState('design@zap.co');
    const [errorEmail, setErrorEmail] = useState('hello@zap');
    const isValidEmail = (email: string) => email.includes('@') && email.includes('.');

    // ── Search States ───────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [searchWithQuery, setSearchWithQuery] = useState('Grid Systems');

    // ── Password States ─────────────────────────────────────────────
    const [password, setPassword] = useState('zap12345');

    // ── Tag Input State ─────────────────────────────────────────────
    const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);

    // ── Multi-Select State ──────────────────────────────────────────
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['react']);
    const frameworkOptions = [
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Angular', value: 'angular' },
        { label: 'Svelte', value: 'svelte' },
        { label: 'Next.js', value: 'nextjs' },
    ];

    // ── Date Picker State ───────────────────────────────────────────
    const [date, setDate] = useState<Date | undefined>(new Date());

    // ── Service Selection State ────────────────────────────────────
    const [open, setOpen] = useState(false);
    const [serviceValue, setServiceValue] = useState("web-dev");
    const [layout, setLayout] = useState<"list" | "grid">("list");
    const [serviceSearchQuery, setServiceSearchQuery] = useState("");
    const filteredItems = serviceItems.filter(item => 
        item.label.toLowerCase().includes(serviceSearchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(serviceSearchQuery.toLowerCase())
    );
    const selectedItem = serviceItems.find((item) => item.value === serviceValue);

    // ── Form State ──────────────────────────────────────────────────
    const formConfig = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="w-full flex flex-col gap-0" style={cssVars}>

            {/* ── SECTION 1: TEXT INPUTS ────────────────────────────────── */}
            <CanvasBody.Section label="TEXT INPUTS">
                <Wrapper identity={{ displayName: "Text Inputs Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Text Inputs</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            Core input molecule states — email validation, search with suggestions, and password reveal patterns.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Email — Focused */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email Address</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Focused variant</span>
                        <Wrapper identity={{ displayName: "Email Focused Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <EmailInput
                                    value={focusedEmail}
                                    onChange={(e) => setFocusedEmail(e.target.value)}
                                    placeholder="Enter email..."
                                    className="w-full"
                                />
                                {isValidEmail(focusedEmail) && (
                                    <Text size="iso-100" className="text-green-500">✓ Valid format</Text>
                                )}
                            </div>
                        </Wrapper>
                        </div>

                        {/* Email — Error */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email Address</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Error variant</span>
                        <Wrapper identity={{ displayName: "Email Error Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <EmailInput
                                    value={errorEmail}
                                    onChange={(e) => setErrorEmail(e.target.value)}
                                    placeholder="Enter email..."
                                    isError={!isValidEmail(errorEmail)}
                                    className="w-full"
                                />
                                {!isValidEmail(errorEmail) && (
                                    <Text size="iso-100" className="text-destructive">Invalid email format</Text>
                                )}
                            </div>
                        </Wrapper>
                        </div>

                        {/* Email — Disabled */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email Address</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Disabled variant</span>
                        <Wrapper identity={{ displayName: "Email Disabled Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <EmailInput
                                    value="admin@zap.co"
                                    placeholder="Locked..."
                                    disabled
                                    className="w-full"
                                />
                                <Text size="iso-100" className="text-muted-foreground">Field locked by admin</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Search — Empty */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Search</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Empty state</span>
                        <Wrapper identity={{ displayName: "Search Empty Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search components..."
                                    className="w-full"
                                />
                            </div>
                        </Wrapper>
                        </div>

                        {/* Search — With Query */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Search</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Active with query</span>
                        <Wrapper identity={{ displayName: "Search Query Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <SearchInput
                                    value={searchWithQuery}
                                    onChange={(e) => setSearchWithQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full"
                                />
                                <Text size="iso-100" className="text-muted-foreground">{searchWithQuery ? `Searching for "${searchWithQuery}"` : ''}</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Password</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Strength indicator</span>
                        <Wrapper identity={{ displayName: "Password Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <PasswordInput
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password..."
                                    className="w-full"
                                />
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`h-1 flex-1 rounded-full ${i < Math.min(password.length / 3, 4) ? 'bg-primary' : 'bg-muted'}`} />
                                    ))}
                                </div>
                                <Text size="iso-100" className="text-muted-foreground">
                                    {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'}
                                </Text>
                            </div>
                        </Wrapper>
                        </div>
                    </div>
                </Wrapper>
            </CanvasBody.Section>

            {/* ── SECTION 2: FORMATTED INPUTS ──────────────────────────── */}
            <CanvasBody.Section label="FORMATTED INPUTS">
                <Wrapper identity={{ displayName: "Formatted Inputs Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Formatted Inputs</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            Genesis formatter atoms — credit card, currency, and phone number with automatic masking and validation.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card Number */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card Number</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Credit card formatting</span>
                        <Wrapper identity={{ displayName: "Card Number Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <CreditCardInput />
                                <Text size="iso-100" className="text-muted-foreground">Auto-formats as 4-digit groups</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Currency</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Amount formatting</span>
                        <Wrapper identity={{ displayName: "Currency Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <CurrencyInput />
                                <Text size="iso-100" className="text-muted-foreground">Locale-aware currency formatting</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Phone Number</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Component Sandbox</span>
                        <Wrapper identity={{ displayName: "Phone Number Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <PhoneNumberInput />
                                <Text size="iso-100" className="text-muted-foreground">International format with country code</Text>
                            </div>
                        </Wrapper>
                        </div>
                    </div>
                </Wrapper>
            </CanvasBody.Section>

            {/* ── SECTION 3: PICKERS ───────────────────────────────────── */}
            <CanvasBody.Section label="PICKERS">
                <Wrapper identity={{ displayName: "Pickers Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Pickers</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            Date and time selection components with calendar overlays and range support.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Single Date */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Date Picker</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Component Sandbox</span>
                        <Wrapper identity={{ displayName: "Select Date Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <DatePicker value={date} onChange={setDate} placeholder="Choose a day..." />
                                <div className="text-xs text-muted-foreground mt-2">
                                    Current value: {date?.toLocaleDateString() || 'None'}
                                </div>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Date Range</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Range selection</span>
                        <Wrapper identity={{ displayName: "Date Range Picker Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <DatePickerWithRange className="w-full" />
                                <Text size="iso-100" className="text-muted-foreground mt-2">Supports range selection</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Select Time */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Time Picker</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Component Sandbox</span>
                        <Wrapper identity={{ displayName: "Select Time Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <TimePicker placeholder="10:30" />
                                <Text size="iso-100" className="text-muted-foreground mt-2">Select hours and minutes</Text>
                            </div>
                        </Wrapper>
                        </div>
                    </div>
                </Wrapper>
            </CanvasBody.Section>

            {/* ── SECTION 4: SELECTION ──────────────────────────────────── */}
            <CanvasBody.Section label="SELECTION">
                <Wrapper identity={{ displayName: "Selection Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Selection</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            Multi-value selection patterns — tag-based input and dropdown multi-select.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Service Selection */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Service Selection</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Entity layout</span>
                        <Wrapper identity={{ displayName: "Service Selection Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3 col-span-1 md:col-span-3 lg:col-span-1">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 h-10 rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] font-medium transition-colors text-transform-primary",
                                                open 
                                                    ? "border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] outline-none ring-[length:var(--input-focus-width,2px)] ring-[color:var(--input-focus-ring,var(--m3-sys-light-primary))] shadow-sm"
                                                    : "border-[color:var(--input-border-filled,transparent)] hover:bg-[color:var(--input-bg-filled-focus,var(--color-surface-container-highest))]"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                {selectedItem ? (
                                                    <span className="font-medium text-[15px]">{selectedItem.label}</span>
                                                ) : (
                                                    "Select Service..."
                                                )}
                                            </div>
                                            <ChevronUp className={cn("opacity-50 transition-transform", !open && "rotate-180")} size={16} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[320px] p-0 rounded-2xl bg-layer-dialog border-outline-variant shadow-xl mt-2 overflow-hidden flex flex-col" align="start">
                                        <Command shouldFilter={false} className="bg-transparent text-transform-primary flex flex-col">
                                            <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-layer-dialog/50">
                                                <div className="relative flex-1">
                                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <input 
                                                        className="flex h-10 w-full rounded-xl border border-primary/40 bg-transparent px-3 py-2 text-sm pl-9 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        placeholder="Search..."
                                                        value={serviceSearchQuery}
                                                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl border-outline-variant text-muted-foreground hover:text-transform-primary">
                                                    <Filter size={16} />
                                                </Button>
                                            </div>
                                            <CommandList className="max-h-[300px] overflow-y-auto p-2 border-b border-border/50 flex-1 relative">
                                                <div className="absolute right-1 top-2 bottom-2 w-1.5 rounded-full bg-border/20 z-10" />
                                                {filteredItems.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center gap-3 py-6 px-4 w-full text-center">
                                                        <span className="text-[13px] text-muted-foreground">No results for &quot;{serviceSearchQuery}&quot;</span>
                                                        <Button className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm transition-colors">
                                                            <Plus size={16} className="mr-2" /> Add New Item
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <CommandGroup className={cn(layout === "grid" && "[&_[cmdk-group-items]]:grid [&_[cmdk-group-items]]:grid-cols-2 [&_[cmdk-group-items]]:gap-2")}>
                                                        {filteredItems.map((item) => {
                                                            const isSelected = serviceValue === item.value;
                                                            return (
                                                                <CommandItem
                                                                    key={item.value}
                                                                    value={item.value}
                                                                    onSelect={(currentValue) => {
                                                                        setServiceValue(currentValue)
                                                                        setOpen(false)
                                                                    }}
                                                                    className={cn(
                                                                        "cursor-pointer transition-all",
                                                                        layout === "list" 
                                                                            ? "flex items-start justify-between px-4 py-3 rounded-xl mb-1 last:mb-0" 
                                                                            : "flex flex-col items-start justify-center p-4 gap-1 rounded-xl border",
                                                                        isSelected 
                                                                            ? (layout === "list" ? "bg-primary/5 text-primary" : "bg-primary/5 border-primary/20 text-primary") 
                                                                            : "text-transform-primary hover:bg-layer-dialog-hover border-transparent"
                                                                    )}
                                                                >
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className={cn("font-medium", layout === "list" ? "text-[15px]" : "text-sm", isSelected && "text-primary")}>
                                                                            {item.label}
                                                                        </span>
                                                                        <span className={cn("text-[12px]", isSelected ? "text-primary/70" : "text-muted-foreground")}>
                                                                            {item.category}
                                                                        </span>
                                                                    </div>
                                                                    {isSelected && layout === "list" && <Check className="ml-auto mt-1 shrink-0 text-primary" size={16} />}
                                                                    {isSelected && layout === "grid" && <div className="absolute top-3 right-3"><Check className="text-primary" size={14} /></div>}
                                                                </CommandItem>
                                                            )
                                                        })}
                                                    </CommandGroup>
                                                )}
                                            </CommandList>
                                            <div className="flex items-center justify-start p-2 px-3 bg-layer-dialog/50 rounded-b-2xl">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setLayout("list")} className={cn("p-2 rounded-md transition-all", layout === "list" ? "text-transform-primary bg-layer-panel shadow-sm border border-border/50" : "text-muted-foreground hover:text-transform-primary hover:bg-layer-dialog-hover")} aria-label="List layout"><ListIcon size={16} strokeWidth={layout === "list" ? 2.5 : 2} /></button>
                                                    <button onClick={() => setLayout("grid")} className={cn("p-2 rounded-md transition-all", layout === "grid" ? "text-transform-primary bg-layer-panel shadow-sm border border-border/50" : "text-muted-foreground hover:text-transform-primary hover:bg-layer-dialog-hover")} aria-label="Grid layout"><LayoutGrid size={16} strokeWidth={layout === "grid" ? 2.5 : 2} /></button>
                                                </div>
                                            </div>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Multi-Select */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Multi-Select</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Component Sandbox</span>
                        <Wrapper identity={{ displayName: "Multi-Select Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <MultiSelect
                                    options={frameworkOptions}
                                    selected={selectedFrameworks}
                                    onChange={setSelectedFrameworks}
                                    placeholder="Pick frameworks..."
                                />
                                <Text size="iso-100" className="text-muted-foreground">{selectedFrameworks.length} selected</Text>
                            </div>
                        </Wrapper>
                        </div>

                        {/* Tag Input */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tag Input</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">Interactive token input</span>
                        <Wrapper identity={{ displayName: "Tag Input Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-3">
                                <TagInput
                                    value={tags}
                                    onChange={setTags}
                                    placeholder="Add a skill..."
                                />
                                <Text size="iso-100" className="text-muted-foreground">{tags.length} tags added</Text>
                            </div>
                        </Wrapper>
                        </div>
                    </div>
                </Wrapper>
            </CanvasBody.Section>

            {/* ── SECTION 5: VERIFICATION ──────────────────────────────── */}
            <CanvasBody.Section label="VERIFICATION">
                <Wrapper identity={{ displayName: "Verification Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Verification</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            One-time password input for multi-factor authentication and verification flows.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Enter Verification Code</span>
                            <span className="text-[10px] font-dev text-muted-foreground block">One-Time Password</span>
                        <Wrapper identity={{ displayName: "OTP Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-4">
                                <InputOTP maxLength={6}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <Text size="iso-100" className="text-muted-foreground">6-digit code sent to your device</Text>
                            </div>
                        </Wrapper>
                        </div>
                    </div>
                </Wrapper>
            </CanvasBody.Section>

            {/* ── SECTION 6: FORM PATTERNS ────────────────────────────── */}
            <CanvasBody.Section label="FORM PATTERNS">
                <Wrapper identity={{ displayName: "Form Patterns Section", type: "Molecule/Display", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                    <div className="flex flex-col gap-2 mb-8">
                        <Heading level={3}>Form Patterns</Heading>
                        <Text size="iso-200" className="text-muted-foreground max-w-xl">
                            Using react-hook-form and zod for robust form validation.
                        </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Wrapper identity={{ displayName: "Form Card", type: "Wrapped Snippet", filePath: "zap/sections/molecules/inputs/InputModulesShowcase.tsx" }}>
                            <div className="bg-surface-container-high p-6 rounded-[var(--input-border-radius,8px)] border border-outline-variant/30 space-y-4">
                                <Text size="iso-100" weight="bold" className="uppercase text-muted-foreground tracking-wider">Validation Form</Text>
                                <Form {...formConfig}>
                                    <form onSubmit={formConfig.handleSubmit(onSubmit)} className="space-y-6 w-full">
                                        <FormField
                                            control={formConfig.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="shadcn" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your public display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </div>
                        </Wrapper>
                    </div>
                </Wrapper>
            </CanvasBody.Section>
        </div>
    );
};
