import React, { useState } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { Button } from '@/genesis/atoms/interactive/button';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { SelectField, SelectItem } from '@/genesis/atoms/interactive/select';
import { Tabs } from '@/genesis/atoms/interactive/Tabs';
import { Heading } from '@/genesis/atoms/typography/headings';
import { Text } from '@/genesis/atoms/typography/text';

const LANGUAGES = [
    { id: 'en', label: 'English' },
    { id: 'vi', label: 'Vietnamese' },
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
    });

    const currentFields = langData[activeLang];
    const setField = (field: keyof UnitFields, value: string) =>
        setLangData((prev) => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header Tabs Matching Image */}
            <div className="flex justify-center bg-background border-outline-variant px-6">
                <Tabs
                    tabs={LANGUAGES as any}
                    activeTab={activeLang}
                    onChange={setActiveLang}
                    className="border-none pb-0"
                />
            </div>

            <div className="flex-1 overflow-auto p-10 space-y-12">
                <section className="max-w-xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <Heading level={4} className="text-on-surface font-bold">General Information</Heading>
                    </div>

                    <div className="space-y-6">
                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="Name"
                            position={lp}
                            label="Name"
                            className="bg-white border-outline-variant h-14"
                            value={currentFields.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />

                        <Input
                            variant="outlined"
                            type="text"
                            placeholder="Short Name"
                            position={lp}
                            label="Short Name"
                            className="bg-white border-outline-variant h-14"
                            value={currentFields.shortName}
                            onChange={(e) => setField('shortName', e.target.value)}
                        />

                        <SelectField
                            label="Precision"
                            position={lp}
                            placeholder="Precision"
                            value={currentFields.precision}
                            onValueChange={(val) => setField('precision', val)}
                            bgColor="white"
                            triggerClassName="border border-outline-variant bg-white h-14"
                        >
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="0.1">.1</SelectItem>
                            <SelectItem value="0.01">.01</SelectItem>
                            <SelectItem value="0.001">.001</SelectItem>
                            <SelectItem value="0.0001">.0001</SelectItem>
                        </SelectField>
                    </div>
                </section>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-center p-6 border-t border-outline-variant bg-white">
                <Button
                    variant="primary"
                    size="lg"
                    className="min-w-[120px] rounded-lg"
                    onClick={() => console.log('Saving...', langData)}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
