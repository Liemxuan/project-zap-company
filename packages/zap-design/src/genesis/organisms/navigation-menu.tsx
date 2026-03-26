'use client';

import * as React from 'react';
import { Button } from '../../genesis/atoms/interactive/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../genesis/molecules/dropdown-menu';
import { Card } from '../../genesis/molecules/card';
import { ChevronDown, Rocket, Shield, Activity, Phone, Database, Cloud } from 'lucide-react';

export function NavigationMenu() {
  return (
    <nav className="flex w-full items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Rocket className="h-6 w-6 text-primary" />
        <span className="font-display font-semibold text-titleMedium text-transform-primary text-on-surface">
          ZAP Engine
        </span>
      </div>

      {/* Main Links */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" className="font-display text-transform-primary">
          Dashboard
        </Button>

        {/* Mega Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-display text-transform-primary group">
              Products
              <ChevronDown className="ml-1 h-4 w-4 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[640px] p-0 border-none bg-transparent shadow-none"
            sideOffset={12}
          >
            <Card className="grid grid-cols-2 gap-4 p-4 bg-surface-container-high shadow-[var(--md-sys-elevation-level3)] border-outline-variant rounded-[length:var(--nav-menu-dropdown-radius,var(--radius-shape-xl))]">
              {/* Product 1 */}
              <div className="flex gap-4 p-3 rounded-[length:var(--nav-menu-item-radius,var(--radius-shape-md))] hover:bg-surface-variant hover:shadow-[var(--md-sys-elevation-level1)] transition-all cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[length:var(--radius-shape-sm)] bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-titleSmall text-transform-primary text-on-surface">
                    Security Gateway
                  </h4>
                  <p className="font-body text-bodyMedium text-transform-secondary text-on-surface-variant mt-1 leading-snug">
                    Enterprise-grade protection with multi-factor auth and anomaly detection.
                  </p>
                </div>
              </div>

              {/* Product 2 */}
              <div className="flex gap-4 p-3 rounded-[length:var(--nav-menu-item-radius,var(--radius-shape-md))] hover:bg-surface-variant hover:shadow-[var(--md-sys-elevation-level1)] transition-all cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[length:var(--radius-shape-sm)] bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-titleSmall text-transform-primary text-on-surface">
                    Fleet Monitoring
                  </h4>
                  <p className="font-body text-bodyMedium text-transform-secondary text-on-surface-variant mt-1 leading-snug">
                    Real-time telemetry and Agent state tracking across the local node.
                  </p>
                </div>
              </div>

              {/* Product 3 */}
              <div className="flex gap-4 p-3 rounded-[length:var(--nav-menu-item-radius,var(--radius-shape-md))] hover:bg-surface-variant hover:shadow-[var(--md-sys-elevation-level1)] transition-all cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[length:var(--radius-shape-sm)] bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-titleSmall text-transform-primary text-on-surface">
                    Data Grid Synapse
                  </h4>
                  <p className="font-body text-bodyMedium text-transform-secondary text-on-surface-variant mt-1 leading-snug">
                    High-density data visualization and multi-column sorting parameters.
                  </p>
                </div>
              </div>

              {/* Product 4 */}
              <div className="flex gap-4 p-3 rounded-[length:var(--nav-menu-item-radius,var(--radius-shape-md))] hover:bg-surface-variant hover:shadow-[var(--md-sys-elevation-level1)] transition-all cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[length:var(--radius-shape-sm)] bg-primary/10">
                  <Cloud className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-titleSmall text-transform-primary text-on-surface">
                    Olympus Cloud
                  </h4>
                  <p className="font-body text-bodyMedium text-transform-secondary text-on-surface-variant mt-1 leading-snug">
                    Distributed cluster management and serverless scaling functions.
                  </p>
                </div>
              </div>
            </Card>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="font-display text-transform-primary">
          Documentation
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button className="font-display text-transform-primary">
          Deploy Hub
        </Button>
      </div>
    </nav>
  );
}
