"use client";

import { useState } from "react";
import { Inspector } from "zap-design/src/genesis/layout/Inspector";

export function WorkspaceInspector() {
  // In a real implementation this would tie into a global provider or jotai atom to handle open/close 
  // currently we'll just mock it as always open for the demo
  const [isOpen] = useState(true);

  return (
    <Inspector 
      title="Inspector" 
      isOpen={isOpen}
      width={320}
    >
      <div className="space-y-4">
        <div className="p-3 bg-layer-base rounded-md border border-border/50 text-xs text-on-surface-variant font-medium">
          Select an element on the canvas to inspect its properties.
        </div>
        {/* We can dynamically inject children here using a Context Provider later */}
      </div>
    </Inspector>
  );
}
