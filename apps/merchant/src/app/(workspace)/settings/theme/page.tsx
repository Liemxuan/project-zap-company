"use client";

import React, { useState, useCallback } from 'react';
import { MerchantCanvas } from 'zap-design/src/genesis/organisms/merchant-workspace-layout';
import { MetroHeader } from 'zap-design/src/genesis/molecules/layout/MetroHeader';
import { Card } from 'zap-design/src/genesis/atoms/surfaces/card';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from 'zap-design/src/lib/animations';
import { Palette, RotateCcw, Upload, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ZAP_API = 'http://localhost:3000';

const COLOR_TOKENS = [
  { key: '--md-sys-color-primary', label: 'Primary', default: '#6750A4' },
  { key: '--md-sys-color-secondary', label: 'Secondary', default: '#625B71' },
  { key: '--md-sys-color-tertiary', label: 'Tertiary', default: '#7D5260' },
  { key: '--md-sys-color-error', label: 'Error', default: '#B3261E' },
  { key: '--md-sys-color-surface', label: 'Surface', default: '#1C1B1F' },
  { key: '--md-sys-color-on-primary', label: 'On Primary', default: '#FFFFFF' },
  { key: '--md-sys-color-on-secondary', label: 'On Secondary', default: '#FFFFFF' },
  { key: '--md-sys-color-on-surface', label: 'On Surface', default: '#E6E1E5' },
];

export default function ThemeSettingsPage() {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(COLOR_TOKENS.map(t => [t.key, t.default]))
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const updateColor = useCallback((key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    setPublished(false);
    // Live preview: inject into document
    document.documentElement.style.setProperty(key, value);
  }, []);

  const resetColors = useCallback(() => {
    const defaults = Object.fromEntries(COLOR_TOKENS.map(t => [t.key, t.default]));
    setColors(defaults);
    setPublished(false);
    COLOR_TOKENS.forEach(t => document.documentElement.style.setProperty(t.key, t.default));
  }, []);

  const publishTheme = useCallback(async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`${ZAP_API}/api/theme/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: 'METRO', variables: colors }),
      });

      if (!res.ok) throw new Error(`Publish failed: ${res.status}`);

      setPublished(true);
      toast.success('Theme Published', {
        description: 'Your brand colors have been synced to the METRO theme.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Publish Failed', {
        description: 'Ensure the ZAP Design Engine is running on port 3000.',
      });
    } finally {
      setIsPublishing(false);
    }
  }, [colors]);

  return (
    <MerchantCanvas>
      <div className="w-full max-w-5xl mx-auto mb-8">
        <MetroHeader
          breadcrumb="Settings / Theme"
          title="Brand Theme Editor"
          badge={null}
          rightSlot={
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetColors} className="gap-2 bg-layer-base/50 backdrop-blur-md">
                <RotateCcw size={16} />
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={publishTheme}
                disabled={isPublishing}
                className="gap-2 shadow-[0_0_20px_rgba(var(--sys-color-primary-rgb),0.3)]"
              >
                {isPublishing ? <Loader2 size={16} className="animate-spin" /> : published ? <Check size={16} /> : <Upload size={16} />}
                {isPublishing ? 'Publishing...' : published ? 'Published' : 'Publish to METRO'}
              </Button>
            </div>
          }
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-20"
      >
        {COLOR_TOKENS.map((token) => (
          <motion.div key={token.key} variants={fadeUp}>
            <Card className="p-4 bg-layer-panel/60 backdrop-blur-xl border border-white/5 dark:border-white/10 [border-radius:var(--layer-2-border-radius)] hover:-translate-y-0.5 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-3">
                <label
                  className="w-10 h-10 rounded-lg border-2 border-border/50 cursor-pointer shrink-0 transition-shadow hover:shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: colors[token.key] }}
                >
                  <input
                    type="color"
                    value={colors[token.key]}
                    onChange={(e) => updateColor(token.key, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
                <div className="flex flex-col overflow-hidden">
                  <Text className="text-sm font-bold text-on-surface truncate">{token.label}</Text>
                  <Text className="text-[10px] font-mono text-on-surface-variant truncate">{colors[token.key]}</Text>
                </div>
              </div>
              <Text className="text-[9px] font-mono text-on-surface-variant/50 truncate">{token.key}</Text>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Live Preview Strip */}
      <div className="w-full max-w-5xl mx-auto mt-4">
        <Card className="p-6 bg-layer-panel border-black [border-radius:var(--layer-2-border-radius)]">
          <Heading level={3} className="text-lg font-bold font-display flex items-center gap-2 mb-4">
            <Palette className="text-primary" size={18} />
            Live Preview
          </Heading>
          <div className="flex flex-wrap gap-3">
            {['primary', 'secondary', 'tertiary', 'error'].map((variant) => (
              <Button key={variant} variant={variant as 'primary'} className="capitalize">
                {variant}
              </Button>
            ))}
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: colors['--md-sys-color-primary'] }} />
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: colors['--md-sys-color-secondary'] }} />
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: colors['--md-sys-color-tertiary'] }} />
            <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: colors['--md-sys-color-surface'], border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </Card>
      </div>
    </MerchantCanvas>
  );
}
