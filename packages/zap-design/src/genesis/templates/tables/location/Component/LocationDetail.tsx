'use client';

import { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { Button } from '../../../../atoms/interactive/button';
import { Input } from '../../../../atoms/interactive/inputs';
import { Textarea } from '../../../../atoms/interactive/textarea';
import { SelectField, SelectItem } from '../../../../atoms/interactive/select';
import { Checkbox } from '../../../../atoms/interactive/checkbox';
import { Heading } from '../../../../atoms/typography/headings';
import { Text } from '../../../../atoms/typography/text';
import { useTheme } from '../../../../../components/ThemeContext';
import { TimePicker } from '../../../../atoms/interactive/time-picker';

import { Location } from '@/services/location/location.model';

/* ────────────────────────────────────────────────────────
 * LocationCreateTemplate
 * ──────────────────────────────────────────────────────── */

function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="space-y-1">
            <Heading level={3}>{title}</Heading>
            {description && (
                <Text size='body-small'>{description}</Text>
            )}
        </div>
    );
}

function HoursRow({ day, defaultEnabled = false, open, close }: { day: string; defaultEnabled?: boolean; open?: string; close?: string }) {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
        <div className="flex items-center gap-3 py-2">
            <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} className="shrink-0" />
            <Text size='body-small' className="w-24">{day}</Text>
            <div className="flex items-center gap-2 flex-1">
                <TimePicker
                    value={enabled ? (open ?? '09:00') : undefined}
                    disabled={!enabled}
                    placeholder="Open"
                    className="w-32"
                />
                <TimePicker
                    value={enabled ? (close ?? '20:00') : undefined}
                    disabled={!enabled}
                    placeholder="Close"
                    className="w-32"
                />
            </div>
        </div>
    );
}

export default function LocationDetail({ onCancel, location, t }: { onCancel?: () => void; location?: Partial<Location>; t?: any }) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';

    return (

        <div className="flex-1 overflow-auto px-6 md:px-10 py-8">
            <div className="w-full max-w-3xl mx-auto space-y-10 pb-20">
                {/* ━━ 1. Basic Information ━━ */}
                <section className="space-y-4">
                    <SectionHeading
                        title="Basic Information"
                        description="Help customers recognize your transactions with your store's location, nickname and a brief description of your products or services."
                    />
                    <div className="space-y-4">
                        <div>
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="e.g. Square Coffee House"
                                position={lp}
                                label="Business Name"
                                defaultValue={location?.business_name ?? ''}
                            />
                        </div>
                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="e.g. Downtown"
                            position={lp}
                            label="Name"
                            defaultValue={location?.name ?? ''}
                        />

                        <div>
                            <Textarea
                                rows={4}
                                placeholder=""
                                position={lp}
                                label="Business description"
                                className="border border-outline-variant bg-layer-base"
                                defaultValue={location?.description || ''}
                            />
                            <div className="flex justify-end mt-1">
                                <Text size='body-small' className="text-muted-foreground">0/400</Text>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ━━ 2. Business Address ━━ */}
                <section className="space-y-4">
                    <SectionHeading title="Address" />
                    <div className="space-y-4">
                        <SelectField
                            label="Location type"
                            position={lp}
                            placeholder="Select type"
                            bgColor="transparent"
                            triggerClassName="border border-outline-variant bg-layer-base"
                        >
                            <SelectItem value="1">Physical location</SelectItem>
                            <SelectItem value="2">Virtual / Online</SelectItem>
                            <SelectItem value="3">Pop-up</SelectItem>
                        </SelectField>
                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="Street address"
                            position={lp}
                            label="Address"
                            defaultValue={location?.address_line_1 ?? ''}
                        />

                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="City"
                            position={lp}
                            label="City"
                            defaultValue={location?.city ?? ''}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField
                                label="Province"
                                position={lp}
                                placeholder="Select province"
                                bgColor="transparent"
                                triggerClassName="border border-outline-variant bg-layer-base"
                                defaultValue={location?.province_id?.toString() ?? ''}
                            >
                                <SelectItem value="hcm">Ho Chi Minh</SelectItem>
                                <SelectItem value="hn">Hanoi</SelectItem>
                            </SelectField>
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="00000"
                                position={lp}
                                label="Postal code"
                                defaultValue={location?.zipcode ?? ''}
                            />
                        </div>
                    </div>
                </section>

                {/* ━━ 3. Contact Information ━━ */}
                <section className="space-y-4">
                    <SectionHeading title="Contact Information" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            variant="outlined"
                            type="email"
                            placeholder="hello@example.com"
                            position={lp}
                            label="Email"
                            defaultValue={location?.email ?? ''}
                        />
                        <Input
                            variant="outlined"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            position={lp}
                            label="Phone"
                            defaultValue={location?.phone_number ?? ''}
                        />
                    </div>
                </section>

                {/* ━━ 4. Social Contact ━━ */}
                <section className="space-y-4">
                    <SectionHeading title="Social contact" />
                    <div className="space-y-4">
                        <Input
                            variant="outlined"
                            type="url"
                            placeholder="https://yourwebsite.com"
                            position={lp}
                            label="Website"
                            defaultValue={location?.website ?? ''}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="@handle"
                                position={lp}
                                label="X (Twitter)"
                                defaultValue={location?.twitter ?? ''}
                            />
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="@handle"
                                position={lp}
                                label="Instagram"
                                defaultValue={location?.instagram ?? ''}
                            />
                        </div>
                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="Page name or URL"
                            position={lp}
                            label="Facebook"
                            defaultValue={location?.facebook ?? ''}
                        />
                    </div>
                </section>

                {/* ━━ 5. Branding ━━ */}
                <section className="space-y-4">
                    <SectionHeading
                        title="Branding"
                        description="Customize your customer facing touchpoints like receipts, invoices, appointment booking flow, and checkout screens with your brand's color and logo."
                    />
                    <div className="flex items-center gap-4 p-4 rounded-[length:var(--radius-card,12px)] border border-outline-variant/30">
                        <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                            <span className="text-background text-lg">🏪</span>
                        </div>
                        <Text size='body-small' className="font-display text-transform-primary font-semibold text-foreground flex-1">My Business</Text>
                        <Button size="sm" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-muted-foreground">
                            <Pencil size={14} />
                        </Button>
                    </div>
                </section>

                {/* ━━ 6. Business Hours ━━ */}
                <section className="space-y-4">
                    <SectionHeading title="Business hours" />
                    <div className="space-y-4">
                        <SelectField
                            label="Time Zone"
                            position={lp}
                            placeholder="Select time zone"
                            bgColor="transparent"
                            triggerClassName="border border-outline-variant bg-layer-base"
                        >
                            <SelectItem value="utc7">Asia/Ho_Chi_Minh (UTC+07:00)</SelectItem>
                            <SelectItem value="est">(GMT-05:00) Eastern Time</SelectItem>
                            <SelectItem value="pst">(GMT-08:00) Pacific Time</SelectItem>
                        </SelectField>
                        <SectionHeading
                            title="Opening hours"
                            description="Let your clients know when you're open."
                        />
                        <div>
                            <HoursRow day="Monday" open={location?.operating_hours?.mon?.open} close={location?.operating_hours?.mon?.close} defaultEnabled={!location?.operating_hours?.mon?.is_closed} />
                            <HoursRow day="Tuesday" open={location?.operating_hours?.tue?.open} close={location?.operating_hours?.tue?.close} defaultEnabled={!location?.operating_hours?.tue?.is_closed} />
                            <HoursRow day="Wednesday" open={location?.operating_hours?.wed?.open} close={location?.operating_hours?.wed?.close} defaultEnabled={!location?.operating_hours?.wed?.is_closed} />
                            <HoursRow day="Thursday" open={location?.operating_hours?.thu?.open} close={location?.operating_hours?.thu?.close} defaultEnabled={!location?.operating_hours?.thu?.is_closed} />
                            <HoursRow day="Friday" open={location?.operating_hours?.fri?.open} close={location?.operating_hours?.fri?.close} defaultEnabled={!location?.operating_hours?.fri?.is_closed} />
                            <HoursRow day="Saturday" open={location?.operating_hours?.sat?.open} close={location?.operating_hours?.sat?.close} defaultEnabled={!location?.operating_hours?.sat?.is_closed} />
                            <HoursRow day="Sunday" open={location?.operating_hours?.sun?.open} close={location?.operating_hours?.sun?.close} defaultEnabled={!location?.operating_hours?.sun?.is_closed} />
                        </div>
                    </div>
                </section>

                {/* ━━ 7. Preferred Language ━━ */}
                <section className="space-y-4">
                    <SectionHeading
                        title="Preferred language"
                        description="Set the language for Square emails and customer receipts."
                    />
                    <SelectField
                        label="Select language"
                        position={lp}
                        placeholder="Select language"
                        bgColor="transparent"
                        triggerClassName="border border-outline-variant bg-layer-base"
                    >
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                    </SelectField>
                </section>

                {/* ━━ 8. Match Items Library ━━ */}
                <section className="space-y-4">
                    <SectionHeading
                        title="Match items library from another location"
                        description={`Matching another location's item library will configure all items, modifiers, taxes and everything found under your Item settings.`}
                    />
                    <SelectField
                        label="Source location"
                        position={lp}
                        placeholder="Select a location"
                        defaultValue="loc1"
                        bgColor="transparent"
                        triggerClassName="border border-outline-variant bg-layer-base"
                    >
                        <SelectItem value="loc1">Flagship LA</SelectItem>
                        <SelectItem value="loc2">NYC Hub</SelectItem>
                        <SelectItem value="loc3">Texas Fulfillment</SelectItem>
                    </SelectField>
                </section>

            </div>
        </div>

    );
}
