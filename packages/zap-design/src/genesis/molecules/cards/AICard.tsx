import * as React from "react";
import { Heading } from "../../atoms/typography/headings";
import { Text } from "../../atoms/typography/text";
import { Users, Settings } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../atoms/interactive/button";
import { LiveBlinker } from "../../atoms/indicators/LiveBlinker";

export interface AICardProps {
  name: string;
  description: string;
  imageUrl?: string;
  icon?: React.ElementType;
  brandColorClass?: string;
  status?: "active" | "offline";
  users?: number;
  onConfig?: () => void;
  className?: string;
}

export function AICard({
  name,
  description,
  imageUrl,
  icon: Icon,
  brandColorClass = "bg-outline/5 text-on-surface-variant",
  status = "offline",
  users = 0,
  onConfig,
  className
}: AICardProps) {
  return (
    <div className={cn("bg-layer-cover border border-outline/10 shadow-sm rounded-[32px] p-6 flex flex-col group hover:shadow-2xl transition-all relative overflow-hidden h-full", className)}>
      {/* Visual Accent */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-all group-hover:scale-125 group-hover:opacity-[0.08]", brandColorClass.split(' ')[1])}>
        {Icon && <Icon className="size-full" />}
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={cn("rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 border border-outline/5 overflow-hidden", imageUrl ? "size-16 bg-white" : cn("size-16", brandColorClass))}>
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="size-full object-contain p-0" />
          ) : (
            Icon && <Icon className="size-7" />
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold px-0 mt-0.5 shrink-0 transition-colors -translate-x-2">
          {status === 'active' ? (
            <LiveBlinker color="green" iconOnly />
          ) : (
            <span className="size-1.5 rounded-full bg-on-surface-variant/30" />
          )}
          <span className={cn(
            "text-[11px] uppercase tracking-wider",
            status === 'active' ? "text-state-success/90" : "text-on-surface-variant/50"
          )}>
            {status === "active" ? "Connected" : "Offline"}
          </span>
        </div>
      </div>

      <div className="mb-6 relative z-10 flex-1">
        <Heading level={3} className="text-on-surface tracking-tight mb-2 font-black truncate leading-tight">{name}</Heading>
        <Text size="body-small" className="text-on-surface-variant font-medium leading-relaxed line-clamp-2">
          {description}
        </Text>
      </div>

      {/* Footer Metrics */}
      <div className="pt-6 border-t border-outline/10 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Users size={16} />
          <div className="flex flex-col">
            <Text size="body-small" weight="bold" className="leading-tight">{users} DAU</Text>
          </div>
        </div>
        
        {onConfig && (
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 group/btn px-4 py-2 rounded-xl hover:bg-outline/5 transition-colors border border-transparent hover:border-outline/10 shadow-sm hover:shadow-inner"
            onClick={onConfig}
          >
            <Settings size={14} className="group-hover/btn:rotate-90 transition-transform duration-500 text-on-surface-variant" />
            <Text size="body-tiny" weight="bold" className="text-on-surface-variant uppercase tracking-widest text-[10px]">Config</Text>
          </Button>
        )}
      </div>
    </div>
  );
}
