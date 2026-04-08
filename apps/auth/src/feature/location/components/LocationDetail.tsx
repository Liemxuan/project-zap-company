'use client';

import React, { useState, useEffect } from 'react';
import { X, Pencil, Loader2 } from 'lucide-react';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Textarea } from 'zap-design/src/genesis/atoms/interactive/textarea';
import { SelectField, SelectItem } from 'zap-design/src/genesis/atoms/interactive/select';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import type { Location, OperatingHours } from '../models/location.model';
import { getLocationByIdServer, updateLocationServer } from '../services/location.server';
import { toast } from 'sonner';

/* ────────────────────────────────────────────────────────
 * Helper Components (Duplicate from Template)
 * ──────────────────────────────────────────────────────── */

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

function HoursRow({ day, defaultEnabled = false, open, close }: { day: string; defaultEnabled?: boolean; open?: string; close?: string }) {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
        <div className="flex items-center gap-3 py-2">
            <Checkbox checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} className="shrink-0" />
            <span className="font-body text-transform-secondary text-sm text-foreground w-24">{day}</span>
            <div className="flex items-center gap-2 flex-1">
                <Input
                    type="time"
                    variant="outlined"
                    defaultValue={enabled ? (open ?? '09:00') : undefined}
                    placeholder="Closed"
                    disabled={!enabled}
                    className="w-32 text-center text-xs"
                />
                <Input
                    type="time"
                    variant="outlined"
                    defaultValue={enabled ? (close ?? '20:00') : undefined}
                    placeholder="Closed"
                    disabled={!enabled}
                    className="w-32 text-center text-xs"
                />
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────
 * LocationDetail (Demeanor: Business First, Zero Filler)
 * ──────────────────────────────────────────────────────── */

interface LocationDetailProps {
    location?: Location | null;
    locationId?: string | null;
    onCancel?: () => void;
}

export function LocationDetail({ location: initialLocation, locationId, onCancel }: LocationDetailProps) {
    const [location, setLocation] = useState<Location | null>(initialLocation || null);
    const [loading, setLoading] = useState<boolean>(!!locationId && !initialLocation);
    const [saving, setSaving] = useState(false);

    const theme = 'metro'; // Law: strictly use Metro theme
    const lp = theme === 'metro' ? 'floating' : 'top';

    useEffect(() => {
        if (locationId && !initialLocation) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const data = await getLocationByIdServer(locationId);
                    if (data) {
                        setLocation(data);
                    } else {
                        toast.error('Could not load location details');
                    }
                } catch (error) {
                    console.error('Error fetching location:', error);
                    toast.error('Failed to fetch location data');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [locationId, initialLocation]);

    const handleSave = async () => {
        if (!location?.id) return;
        setSaving(true);
        try {
            const result = await updateLocationServer(location.id, location);
            if (result) {
                toast.success('Location updated successfully');
                onCancel?.();
            } else {
                toast.error('Failed to update location');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('An unexpected error occurred during save');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof Location, value: any) => {
        if (!location) return;
        setLocation({ ...location, [field]: value });
    };

    const getOperatingHours = (day: keyof OperatingHours): { open: string; close: string; is_closed: boolean } | undefined => {
        if (location?.operating_hours && typeof location.operating_hours === 'object') {
            return location.operating_hours[day];
        }
        return undefined;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col bg-layer-cover/20 backdrop-blur-sm items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 font-body text-sm text-foreground">Retaining location data...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-layer-cover overflow-hidden">
            {/* ── Top Bar (Duplicate Structure) ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/40 bg-layer-base shrink-0">
                <button
                    onClick={onCancel}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                >
                    <X size={18} />
                </button>
                <Heading level={4}>Location details</Heading>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="font-display text-transform-primary text-xs h-8 px-5 rounded-lg shadow-sm"
                >
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </div>

            {/* ── Scrollable Form (100% HTML Parity) ── */}
            <div className="flex-1 overflow-auto bg-layer-cover/10 px-6 md:px-10 py-8">
                <div className="w-full max-w-lg mx-auto space-y-10 pb-20">

                    {/* ━━ 1. Basic Information ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Basic Information"
                            description="Help customers recognize your transactions with your store's location, nickname and a brief description of your products or services."
                        />
                        <div className="space-y-4">
                            <div>
                                <span className="text-primary text-[10px] font-medium cursor-pointer hover:underline">What is this?</span>
                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="e.g. Square Coffee House"
                                    position={lp}
                                    label="Location business name"
                                    value={location?.business_name || ''}
                                    onChange={(e) => handleChange('business_name', e.target.value)}
                                />
                            </div>
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="e.g. Downtown"
                                position={lp}
                                label="Location nickname"
                                value={location?.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                            <p className="text-[10px] font-body text-transform-secondary text-muted-foreground leading-relaxed">
                                Your Location Business Name can be changed for free every 90 months. Changing your location business name does not give you access to a Google Plus identity. If you want to make a change out of the timeline, please{' '}
                                <span className="text-primary font-medium underline cursor-pointer">contact Support</span>.
                            </p>
                            <div>
                                <Textarea
                                    rows={4}
                                    placeholder=""
                                    position={lp}
                                    label="Business description"
                                    className="border border-outline-variant bg-white"
                                    value={location?.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-muted-foreground font-body">
                                        {(location?.description?.length || 0)}/400
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ━━ 2. Business Address ━━ */}
                    <section className="space-y-4">
                        <SectionHeading title="Business address" />
                        <div className="space-y-4">
                            <SelectField
                                label="Location type"
                                position={lp}
                                placeholder="Select type"
                                bgColor="white"
                                triggerClassName="border border-outline-variant"
                                value={location?.location_type_id?.toString()}
                                onValueChange={(v) => handleChange('location_type_id', parseInt(v))}
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
                                label="Address line 1"
                                value={location?.address_line_1 || ''}
                                onChange={(e) => handleChange('address_line_1', e.target.value)}
                            />
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="Apt, suite, unit, etc."
                                position={lp}
                                label="Address line 2"
                                value={location?.address_line_2 || ''}
                                onChange={(e) => handleChange('address_line_2', e.target.value)}
                            />
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="City"
                                position={lp}
                                label="City"
                                value={location?.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectField
                                    label="Province"
                                    position={lp}
                                    placeholder="Select province"
                                    bgColor="white"
                                    triggerClassName="border border-outline-variant"
                                    value={location?.state || ''}
                                    onValueChange={(v) => handleChange('state', v)}
                                >
                                    <SelectItem value="Hồ Chí Minh">Ho Chi Minh</SelectItem>
                                    <SelectItem value="Hà Nội">Hanoi</SelectItem>
                                </SelectField>
                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="00000"
                                    position={lp}
                                    label="Postal code"
                                    value={location?.postal_code || location?.zipcode || ''}
                                    onChange={(e) => handleChange('postal_code', e.target.value)}
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
                                value={location?.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                            <Input
                                variant="outlined"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                position={lp}
                                label="Phone"
                                value={location?.phone_number || ''}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
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
                                value={location?.website || ''}
                                onChange={(e) => handleChange('website', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="@handle"
                                    position={lp}
                                    label="X (Twitter)"
                                    value={location?.x_link || location?.twitter || ''}
                                    onChange={(e) => handleChange('x_link', e.target.value)}
                                />
                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="@handle"
                                    position={lp}
                                    label="Instagram"
                                    value={location?.instagram_link || location?.instagram || ''}
                                    onChange={(e) => handleChange('instagram_link', e.target.value)}
                                />
                            </div>
                            <Input
                                variant="outlined"
                                type="text"
                                placeholder="Page name or URL"
                                position={lp}
                                label="Facebook"
                                value={location?.facebook_link || location?.facebook || ''}
                                onChange={(e) => handleChange('facebook_link', e.target.value)}
                            />
                        </div>
                    </section>

                    {/* ━━ 5. Branding ━━ */}
                    <section className="space-y-4">
                        <SectionHeading
                            title="Branding"
                            description="Customize your customer facing touchpoints like receipts, invoices, appointment booking flow, and checkout screens with your brand's color and logo."
                        />
                        <div className="flex items-center gap-4 p-4 rounded-[length:var(--radius-card,12px)] border border-outline-variant/30 bg-layer-base">
                            <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                                <span className="text-background text-lg">🏪</span>
                            </div>
                            <p className="font-display text-transform-primary text-sm font-semibold text-foreground flex-1">
                                {location?.business_name || 'My Business'}
                            </p>
                            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-muted-foreground">
                                <Pencil size={14} />
                            </button>
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
                                bgColor="white"
                                triggerClassName="border border-outline-variant"
                                defaultValue="utc7"
                            >
                                <SelectItem value="utc7">Asia/Ho_Chi_Minh (UTC+07:00)</SelectItem>
                                <SelectItem value="est">(GMT-05:00) Eastern Time</SelectItem>
                                <SelectItem value="pst">(GMT-08:00) Pacific Time</SelectItem>
                            </SelectField>
                            <SectionHeading
                                title="Regular hours"
                                description="Let your clients know when you're open."
                            />
                            <div>
                                <HoursRow day="Monday" open={getOperatingHours('mon')?.open} close={getOperatingHours('mon')?.close} defaultEnabled={!getOperatingHours('mon')?.is_closed} />
                                <HoursRow day="Tuesday" open={getOperatingHours('tue')?.open} close={getOperatingHours('tue')?.close} defaultEnabled={!getOperatingHours('tue')?.is_closed} />
                                <HoursRow day="Wednesday" open={getOperatingHours('wed')?.open} close={getOperatingHours('wed')?.close} defaultEnabled={!getOperatingHours('wed')?.is_closed} />
                                <HoursRow day="Thursday" open={getOperatingHours('thu')?.open} close={getOperatingHours('thu')?.close} defaultEnabled={!getOperatingHours('thu')?.is_closed} />
                                <HoursRow day="Friday" open={getOperatingHours('fri')?.open} close={getOperatingHours('fri')?.close} defaultEnabled={!getOperatingHours('fri')?.is_closed} />
                                <HoursRow day="Saturday" open={getOperatingHours('sat')?.open} close={getOperatingHours('sat')?.close} defaultEnabled={!getOperatingHours('sat')?.is_closed} />
                                <HoursRow day="Sunday" open={getOperatingHours('sun')?.open} close={getOperatingHours('sun')?.close} defaultEnabled={!getOperatingHours('sun')?.is_closed} />
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
                            label="Preferred language"
                            position={lp}
                            placeholder="Select language"
                            bgColor="white"
                            triggerClassName="border border-outline-variant"
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
                            bgColor="white"
                            triggerClassName="border border-outline-variant"
                        >
                            <SelectItem value="loc1">Flagship LA</SelectItem>
                            <SelectItem value="loc2">NYC Hub</SelectItem>
                            <SelectItem value="loc3">Texas Fulfillment</SelectItem>
                        </SelectField>
                    </section>
                </div>
            </div>
        </div>
    );
}
