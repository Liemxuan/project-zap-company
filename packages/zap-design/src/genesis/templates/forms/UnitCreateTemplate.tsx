'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/inputs';
import { SelectField, SelectItem } from '../../atoms/interactive/select';
import { Tabs } from '../../atoms/interactive/Tabs';
import { Heading } from '../../atoms/typography/headings';
import { Text } from '../../atoms/typography/text';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
    { id: 'ja', label: '日本語' },
] as const;

interface UnitFields {
    name: string;
    shortName: string;
    precision: string;
}

export default function UnitCreateTemplate({ onCancel }: { onCancel?: () => void }) {
    const { theme } = useTheme();
    const lp = theme === 'metro' ? 'floating' : 'top';
    const [activeLang, setActiveLang] = useState<string>('en');

    const [langData, setLangData] = useState<Record<string, UnitFields>>({
        en: { name: '', shortName: '', precision: '1' },
        vi: { name: '', shortName: '', precision: '1' },
        ja: { name: '', shortName: '', precision: '1' },
    });

    const currentFields = langData[activeLang];
    const setField = (field: keyof UnitFields, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Language tabs — sticky below header */}
            <div className="sticky top-0 z-10 flex justify-center border-b border-outline-variant bg-background px-6">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="flex-1 overflow-auto py-12 px-6 lg:px-10">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-10 items-start">
                    {/* ━━ LEFT COLUMN ━━ */}
                    <div className="space-y-10">
                        <section className="space-y-6">
                            <div className="space-y-1">
                                <Heading level={4}>General Information</Heading>
                                <Text size='body-small'>Define the unit of measure details and how it appears in the system.</Text>
                            </div>

                            <div className="space-y-5">
                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="e.g. Kilogram"
                                    position={lp}
                                    label="Unit Name"
                                    className="bg-white border-outline-variant h-14"
                                    value={currentFields.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                />

                                <Input
                                    variant="outlined"
                                    type="text"
                                    placeholder="e.g. kg"
                                    position={lp}
                                    label="Short Name"
                                    className="bg-white border-outline-variant h-14"
                                    value={currentFields.shortName}
                                    onChange={(e) => setField('shortName', e.target.value)}
                                />
                            </div>
                        </section>
                    </div>

                    {/* ━━ RIGHT COLUMN ━━ */}
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <div className="space-y-1">
                                <Heading level={4}>Configuration</Heading>
                                <Text size='body-small'>Set the precision and rounding rules.</Text>
                            </div>
                            <SelectField
                                label="Precision"
                                position={lp}
                                placeholder="Select Precision"
                                value={currentFields.precision}
                                onValueChange={(val) => setField('precision', val)}
                                bgColor="white"
                                triggerClassName="border border-outline-variant bg-white h-12"
                            >
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="0.1">.1</SelectItem>
                                <SelectItem value="0.01">.01</SelectItem>
                                <SelectItem value="0.001">.001</SelectItem>
                                <SelectItem value="0.0001">.0001</SelectItem>
                            </SelectField>
                            <div className="pt-2">
                                <Text size="body-small" className="text-muted-foreground italic">
                                    Note: Precision affects how quantities are displayed and calculated across the app.
                                </Text>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
