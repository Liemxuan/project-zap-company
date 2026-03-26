'use client';

import * as React from 'react';
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type StepperOrientation = 'horizontal' | 'vertical';
type StepState = 'active' | 'completed' | 'inactive' | 'error';

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: StepperOrientation;
  stepsCount: number;
  registerStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used within a Stepper');
  return ctx;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
}

export function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: StepperProps) {
  const [internalStep, setInternalStep] = useState(defaultValue);
  const [steps, setSteps] = useState<number[]>([]);

  const activeStep = value ?? internalStep;

  const handleSetActiveStep = useCallback((step: number) => {
    if (value === undefined) setInternalStep(step);
    onValueChange?.(step);
  }, [value, onValueChange]);

  const registerStep = useCallback((step: number) => {
    setSteps(prev => prev.includes(step) ? prev : [...prev, step].sort((a, b) => a - b));
  }, []);

  const contextValue = useMemo(() => ({
    activeStep,
    setActiveStep: handleSetActiveStep,
    orientation,
    stepsCount: steps.length,
    registerStep,
  }), [activeStep, handleSetActiveStep, orientation, steps.length, registerStep]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        className={cn(
          "flex w-full self-stretch",
          orientation === 'horizontal' ? "flex-row items-center" : "flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  title: string;
  description?: string;
  error?: boolean;
}

export function StepperItem({
  step,
  title,
  description,
  error = false,
  className,
  ...props
}: StepperItemProps) {
  const { activeStep, orientation, registerStep } = useStepper();

  useEffect(() => {
    registerStep(step);
  }, [step, registerStep]);

  const state: StepState = error ? 'error' : step < activeStep ? 'completed' : step === activeStep ? 'active' : 'inactive';

  return (
    <div
      data-slot="stepper-item"
      data-state={state}
      className={cn(
        "relative flex flex-1 items-center gap-4 group/step",
        orientation === 'horizontal' ? "flex-row not-last:pr-8" : "flex-col items-start not-last:pb-8",
        className
      )}
      {...props}
    >
      {/* Connector line for vertical or horizontal (simplified for standard layouts) */}
      {orientation === 'horizontal' && (
        <div className="absolute top-6 left-[calc(50%+1.5rem)] right-0 h-0.5 bg-border/40 group-last/step:hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: step < activeStep ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full bg-primary origin-left"
          />
        </div>
      )}

      {/* Indicator */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: state === 'active' ? 1.1 : 1,
            backgroundColor: state === 'completed' ? 'var(--md-sys-color-primary)' : state === 'error' ? 'var(--md-sys-color-error)' : 'transparent',
          }}
          className={cn(
            "size-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300",
            state === 'inactive' && "border-outline-variant/60 text-on-surface-variant text-transform-secondary",
            state === 'active' && "border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]",
            state === 'completed' && "border-primary text-primary-foreground",
            state === 'error' && "border-error text-error-foreground"
          )}
        >
          {state === 'completed' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="size-5 stroke-[3]" /></motion.div>
          ) : (
            <span>{step}</span>
          )}
        </motion.div>
        
        {/* Pulse effect for active step */}
        {state === 'active' && (
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col text-left">
        <span className={cn(
          "text-sm font-black uppercase tracking-tight transition-colors",
          state === 'inactive' ? "text-on-surface-variant text-transform-secondary" : "text-on-surface text-transform-primary"
        )}>
          {title}
        </span>
        {description && (
          <span className="text-xs text-on-surface-variant text-transform-secondary line-clamp-1">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

// Stepper Panels for content selection
export function StepperContent({ step, children, className }: { step: number; children: React.ReactNode; className?: string }) {
  const { activeStep } = useStepper();
  const isActive = activeStep === step;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className={cn("w-full h-full", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
