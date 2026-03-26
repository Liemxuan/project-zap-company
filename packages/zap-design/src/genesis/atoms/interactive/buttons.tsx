import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '../../../lib/utils'

/**
 * Genesis Button — Theme-Driven Visual Resolution
 *
 * Visual styling (bg, text, border, hover, shadow) is driven entirely by CSS
 * custom properties via data-attributes. The theme publishes resolved variables
 * for each visualStyle x color combination. CVA handles only structural layout
 * (size, iconPosition). See: src/styles/genesis-button.css
 *
 * Props `visualStyle`, `color`, and `variant` select which data-attributes are
 * rendered. The CSS file matches those attributes and applies the theme's
 * resolved variables. If no props are passed, defaults are used (solid/primary/flat).
 */

const buttonVariants = cva(
  "genesis-btn inline-flex items-center justify-center whitespace-nowrap font-secondary text-transform-secondary font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      size: {
        default: "px-[var(--button-padding-x,16px)] py-[var(--button-padding-y,8px)] gap-[var(--button-icon-gap,8px)] min-h-[40px] text-sm",
        tiny: "h-6 px-2 text-[10px] gap-1",
        compact: "h-8 px-3 text-xs gap-1.5",
        medium: "h-10 px-4 text-sm gap-2",
        expanded: "h-12 px-6 text-base gap-3",
        icon: "w-[calc(var(--button-padding-y,8px)*2+20px)] h-[calc(var(--button-padding-y,8px)*2+20px)] p-0 flex justify-center items-center",
      },
      iconPosition: {
        none: "",
        left: "flex-row",
        right: "flex-row-reverse",
        top: "flex-col !h-auto py-3",
      },
    },
    defaultVariants: {
      size: "default",
      iconPosition: "left",
    },
  }
)

type VisualStyle = "solid" | "outline" | "ghost" | "elevated" | "tonal";
type ButtonColor = "primary" | "secondary" | "tertiary" | "destructive";
type VariantStyle = "flat" | "soft" | "neo" | "glow";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  visualStyle?: VisualStyle | null
  color?: ButtonColor | null
  variant?: VariantStyle | string | null
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, visualStyle, size, color, iconPosition, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Legacy shadcn variant compatibility
    const legacyVariants = ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'];
    const isLegacyVariant = legacyVariants.includes(variant as string);

    // Track whether visual props were explicitly provided
    const hasExplicitVisual = !!visualStyle || isLegacyVariant;
    const hasExplicitColor = !!color || isLegacyVariant;
    const hasExplicitVariant = !!variant;

    let resolvedVisual: VisualStyle | undefined = visualStyle as VisualStyle | undefined;
    let resolvedColor: ButtonColor | undefined = color as ButtonColor | undefined;
    let resolvedVariant: VariantStyle | undefined = undefined;
    let additionalClasses = "";

    if (isLegacyVariant) {
        switch (variant as string) {
            case 'primary':
            case 'default':
                resolvedVisual = 'solid';
                resolvedColor = 'primary';
                break;
            case 'secondary':
                resolvedVisual = 'solid';
                resolvedColor = 'secondary';
                break;
            case 'destructive':
                resolvedVisual = 'solid';
                resolvedColor = 'destructive';
                break;
            case 'outline':
                resolvedVisual = 'outline';
                additionalClasses = "border-input bg-background hover:bg-accent hover:text-accent-foreground";
                break;
            case 'ghost':
                resolvedVisual = 'ghost';
                additionalClasses = "hover:bg-accent hover:text-accent-foreground";
                break;
            case 'link':
                resolvedVisual = 'ghost';
                resolvedColor = 'primary';
                additionalClasses = "underline-offset-4 hover:underline";
                break;
        }
    } else if (variant && ['flat', 'soft', 'neo', 'glow'].includes(variant as string)) {
        resolvedVariant = variant as VariantStyle;
    }

    // Only set data attributes when props are explicitly provided.
    // When omitted, the base .genesis-btn CSS rule reads --button-resolved-*
    // variables from the theme, giving the theme full control.
    const dataAttrs: Record<string, string | undefined> = {};
    if (hasExplicitVisual && resolvedVisual) dataAttrs['data-visual'] = resolvedVisual;
    if (hasExplicitColor && resolvedColor) dataAttrs['data-color'] = resolvedColor;
    if (hasExplicitVariant && resolvedVariant) dataAttrs['data-variant'] = resolvedVariant;

    return (
      <Comp
        className={cn(buttonVariants({ size, iconPosition, className }), additionalClasses)}
        ref={ref}
        {...dataAttrs}
        style={Object.assign(
          {},
          {
            borderRadius: 'var(--button-border-radius, 9999px)',
            borderWidth: 'var(--button-border-width, 1px)',
            borderStyle: 'var(--button-border-style, solid)'
          },
          props.style as React.CSSProperties
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
