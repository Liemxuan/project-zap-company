import { z } from 'zod';

export const buttonStateSchema = z.object({
  visualStyle: z.enum(['solid', 'outline', 'ghost']).default('solid'),
  variant: z.enum(['flat', 'soft', 'neo', 'glow']).default('flat'),
  size: z.enum(['default', 'tiny', 'compact', 'medium', 'expanded']).default('medium'),
  color: z.enum(['primary', 'secondary', 'destructive']).default('primary'),
  platform: z.enum(['agnostic', 'ios', 'android']).default('agnostic'),
});

export type ButtonState = z.infer<typeof buttonStateSchema>;
