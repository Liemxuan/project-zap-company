'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/inputs';
import { Textarea } from '../../atoms/interactive/textarea';
import { Label } from '../../atoms/interactive/label';
import { Checkbox } from '../../atoms/interactive/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/interactive/select';
import { Heading } from '../../atoms/typography/headings';
/* ────────────────────────────────────────────────────────
 * LocationCreateTemplate
 * Matches the "Location details" reference — single-column
 * form, no sidebar, top bar with X + Save.
 * L1→L6 tokens throughout, zero hardcoded hex.
 * ──────────────────────────────────────────────────────── */

/* ── Section heading ── */
function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <h2 className="font-display text-transform-primary text-base font-semibold text-foreground">{title}</h2>
            {description && (
                <p className="font-body text-transform-secondary text-xs text-muted-foreground leading-relaxed">{description}</p>
            )}
        </div>
    );
}

/* ── Field label ── */
function FieldLabel({ children, trailing }: { children: React.ReactNode; trailing?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-1.5">
            <Label className="block font-body text-sm font-medium tracking-wide text-transform-secondary text-muted-foreground">
                {children}
            </Label>
            {trailing}
        </div>
    );
}

/* ── Business-hours row ── */
function HoursRow({ day, defaultEnabled = false, open, close }: { day: string; defaultEnabled?: boolean; open?: string; close?: string }) {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
        <div className="flex items-center gap-3 py-2">
            <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} className="shrink-0" />
            <span className="font-body text-transform-secondary text-sm text-foreground w-24">{day}</span>
            <div className="flex items-center gap-2 flex-1">
                <Input
                    type="time"
                    variant='outlined'
                    defaultValue={enabled ? (open ?? '09:00 AM') : undefined}
                    placeholder="Closed"
                    disabled={!enabled}
                    className="w-32 text-center text-xs bg-white"
                />
                <Input
                    type="time"
                    variant='outlined'
                    defaultValue={enabled ? (close ?? '08:00 PM') : undefined}
                    placeholder="Closed"
                    disabled={!enabled}
                    className="w-32 text-center text-xs bg-white"
                />
            </div>
        </div>
    );
}

export default function LocationCreateTemplate({ onCancel }: { onCancel?: () => void }) {
    return (
        <div className="flex-1 flex flex-col min-w-0 bg-layer-cover relative">
            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/40 bg-gray-50 shrink-0">
                <button onClick={onCancel} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground">
                    <X size={18} />
                </button>
                <Heading level={4}>Location details</Heading>
                <Button variant="primary" size="sm" className="font-display text-transform-primary text-xs h-8 px-5 rounded-lg shadow-sm">
                    Save
                </Button>
            </div>

            {/* ── Scrollable Form ── */}
            <div className="flex-1 overflow-auto px-6 md:px-10 py-8 bg-layer-cover bg-white">
                <div className="w-full max-w-lg mx-auto space-y-10 pb-20">

                    {/* ━━ 1. Basic Information ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Basic Information"
                            description="Help customers recognize your transactions with your store's location, nickname and a brief description of your products or services."
                        />
                        <div className="space-y-4">
                            <div>
                                <FieldLabel trailing={<span className="text-primary text-[10px] font-medium cursor-pointer hover:underline">What is this?</span>}>
                                    Location business name
                                </FieldLabel>
                                <Input variant='outlined' type="text" placeholder="Modistry" />
                            </div>
                            <div>
                                <FieldLabel>Location nickname</FieldLabel>
                                <Input variant='outlined' type="text" placeholder="" trailingIcon="error" />
                            </div>
                            <p className="text-[10px] font-body text-transform-secondary text-muted-foreground leading-relaxed">
                                Your Location Business Name can be changed for free every 90 months. Changing your location business name does not give you access to a Google Plus identity. If you want to make a change out of the timeline, please{' '}
                                <span className="text-primary font-medium underline cursor-pointer">contact Support</span>.
                            </p>
                            <div>
                                <FieldLabel>Business description</FieldLabel>
                                <Textarea rows={4} placeholder="" className='bg-white' />
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-muted-foreground font-body">0/400</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ━━ 2. Business Address ━━ */}
                    <section className="space-y-4">
                        <SectionHeading title="Business address" />
                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Location type</FieldLabel>
                                <Select>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Physical location" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="physical">Physical location</SelectItem>
                                        <SelectItem value="virtual">Virtual / Online</SelectItem>
                                        <SelectItem value="popup">Pop-up</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel>Address line 1</FieldLabel>
                                <Input variant='outlined' type="text" placeholder="" />
                            </div>
                            <div>
                                <FieldLabel>Address line 2</FieldLabel>
                                <Input variant='outlined' type="text" placeholder="" />
                            </div>
                            <div>
                                <FieldLabel>City</FieldLabel>
                                <Input variant='outlined' type="text" placeholder="" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Province</FieldLabel>
                                    <Select>
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white'>
                                            <SelectItem value="hcm">Ho Chi Minh</SelectItem>
                                            <SelectItem value="hn">Hanoi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <FieldLabel>Postal code</FieldLabel>
                                    <Input variant='outlined' type="text" placeholder="" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ━━ 3. Contact Information ━━ */}
                    <section className="space-y-4">
                        <SectionHeading title="Contact Information" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel>Email</FieldLabel>
                                <Input variant='outlined' type="email" placeholder="Email" />
                            </div>
                            <div>
                                <FieldLabel>Phone</FieldLabel>
                                <Input variant='outlined' type="tel" placeholder="Phone" />
                            </div>
                        </div>
                    </section>

                    {/* ━━ 4. Social Contact ━━ */}
                    <section className="space-y-4">
                        <SectionHeading title="Social contact" />
                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Website</FieldLabel>
                                <Input variant='outlined' type="url" placeholder="Website" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>X</FieldLabel>
                                    <Input variant='outlined' type="text" placeholder="X" />
                                </div>
                                <div>
                                    <FieldLabel>Instagram</FieldLabel>
                                    <Input variant='outlined' type="text" placeholder="Instagram" />
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Facebook</FieldLabel>
                                <Input variant='outlined' type="text" placeholder="Facebook" />
                            </div>
                        </div>
                    </section>

                    {/* ━━ 5. Branding ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Branding"
                            description="Customize your customer facing touchpoints like receipts, invoices, appointment booking flow, and checkout screens with your brand's color and logo."
                        />
                        <div className="flex items-center gap-4 p-4 bg-white rounded-[length:var(--radius-card,12px)] border border-outline-variant/30">
                            <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                                <span className="text-background text-lg">🏪</span>
                            </div>
                            <p className="font-display text-transform-primary text-sm font-semibold text-foreground flex-1">My Business</p>
                            <button className="h-8 w-8 flex items-center justify-center rounded-full  hover:bg-surface-variant/60 transition-colors text-muted-foreground">
                                <Pencil size={14} />
                            </button>
                        </div>
                    </section>

                    {/* ━━ 6. Business Hours ━━ */}
                    <section className="space-y-4">
                        <SectionHeading title="Business hours" />
                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Time Zone</FieldLabel>
                                <Select>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Asia/Muscat (UTC+07:00)" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                        <SelectItem value="utc7">Asia/Ho_Chi_Minh (UTC+07:00)</SelectItem>
                                        <SelectItem value="est">(GMT-05:00) Eastern Time</SelectItem>
                                        <SelectItem value="pst">(GMT-08:00) Pacific Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <SectionHeading
                                    title="Regular hours"
                                    description="Let your clients know when you're open."
                                />
                            </div>
                            <div>
                                <HoursRow day="Monday" />
                                <HoursRow day="Tuesday" />
                                <HoursRow day="Wednesday" />
                                <HoursRow day="Thursday" />
                                <HoursRow day="Friday" />
                                <HoursRow day="Saturday" />
                                <HoursRow day="Sunday" />
                            </div>
                        </div>
                    </section>

                    {/* ━━ 7. Preferred Language ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Preferred language"
                            description="Set the language for Square emails and customer receipts."
                        />
                        <div>
                            <FieldLabel>Select language</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="English" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="vi">Vietnamese</SelectItem>
                                    <SelectItem value="ja">Japanese</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                    {/* ━━ 8. Match Items Library ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Match items library from another location"
                            description={`Matching another location's item library will configure all items, modifiers, taxes and everything found under your Item settings.`}
                        />
                        <div>
                            <FieldLabel>Location</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="loc1">Flagship LA</SelectItem>
                                    <SelectItem value="loc2">NYC Hub</SelectItem>
                                    <SelectItem value="loc3">Texas Fulfillment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
