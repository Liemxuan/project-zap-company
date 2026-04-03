'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../genesis/molecules/card';
import { Switch } from '../../genesis/atoms/interactive/switch';
import { Slider } from '../../genesis/atoms/interactive/slider';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { Progress } from '../../genesis/atoms/interactive/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../genesis/atoms/interactive/tooltip';
import { Button } from '../../genesis/atoms/interactive/button';
import { Info } from 'lucide-react';

export function InteractiveGallery() {
  const [progress, setProgress] = React.useState(33);
  const [sliderValue, setSliderValue] = React.useState([50]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
      <Card className="bg-surface-container shadow-[var(--md-sys-elevation-level1)] border-outline-variant rounded-[length:var(--interactive-gallery-card-radius,var(--radius-shape-xl))] border-[length:var(--interactive-gallery-card-border-width,1px)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-titleLarge text-transform-primary">Toggles</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-on-surface text-surface font-body text-transform-secondary text-bodyMedium border-none">
                  Switch component mapping to M3 variables.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription className="font-body text-bodyMedium text-transform-secondary">
            Binary state selection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="airplane-mode" className="font-body text-bodyLarge font-medium text-on-surface text-transform-secondary">
              Airplane Mode
            </label>
            <Switch id="airplane-mode" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="notifications" className="font-body text-bodyLarge font-medium text-on-surface text-transform-secondary">
              Notifications
            </label>
            <Switch id="notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-container shadow-[var(--md-sys-elevation-level1)] border-outline-variant rounded-[length:var(--interactive-gallery-card-radius,var(--radius-shape-xl))] border-[length:var(--interactive-gallery-card-border-width,1px)]">
        <CardHeader>
          <CardTitle className="font-display text-titleLarge text-transform-primary">Checkboxes</CardTitle>
          <CardDescription className="font-body text-bodyMedium text-transform-secondary">
            Multi-selection inputs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="terms" defaultChecked />
            <label
              htmlFor="terms"
              className="font-body text-bodyMedium font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-on-surface text-transform-secondary"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="marketing" />
            <label
              htmlFor="marketing"
              className="font-body text-bodyMedium font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-on-surface text-transform-secondary"
            >
              Receive marketing emails
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-container shadow-[var(--md-sys-elevation-level1)] border-outline-variant col-span-1 md:col-span-2 lg:col-span-1 rounded-[length:var(--interactive-gallery-card-radius,var(--radius-shape-xl))] border-[length:var(--interactive-gallery-card-border-width,1px)]">
        <CardHeader>
          <CardTitle className="font-display text-titleLarge text-transform-primary">Range & Progress</CardTitle>
          <CardDescription className="font-body text-bodyMedium text-transform-secondary">
            Continuous value inputs and deterministic loading.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
 <label className="font-body text-transform-secondary text-bodySmall font-medium text-on-surface-variant text-transform-tertiary tracking-wider">
                Volume
              </label>
              <span className="font-body text-transform-secondary text-bodySmall font-medium text-on-surface text-transform-tertiary">
                {sliderValue[0]}%
              </span>
            </div>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              value={sliderValue}
              onValueChange={setSliderValue}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
 <label className="font-body text-transform-secondary text-bodySmall font-medium text-on-surface-variant text-transform-tertiary tracking-wider">
                System Load
              </label>
              <span className="font-body text-transform-secondary text-bodySmall font-medium text-on-surface text-transform-tertiary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>Decrease</Button>
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>Increase</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
