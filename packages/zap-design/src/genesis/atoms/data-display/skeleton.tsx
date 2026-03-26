import { cn } from '../../../lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse bg-primary/10",
        "rounded-[length:var(--skeleton-border-radius,6px)]",
        "border-[length:var(--skeleton-border-width,0px)] border-primary/20",
        "opacity-[var(--skeleton-opacity,1)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
