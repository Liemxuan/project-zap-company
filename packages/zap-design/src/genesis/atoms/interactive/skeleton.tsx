import { cn } from '../../../lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse bg-muted border-primary/20",
        "rounded-[length:var(--skeleton-border-radius,var(--radius))]",
        "border-[length:var(--skeleton-border-width,0px)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
