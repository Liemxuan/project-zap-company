"use client"

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { DataGrid } from '../../../../../genesis/organisms/data-grid';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from '../../../../../genesis/atoms/interactive/button'
import { Checkbox } from '../../../../../genesis/atoms/interactive/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../../genesis/molecules/dropdown-menu'
import { Pill, PillVariant } from '../../../../../genesis/atoms/status/pills'
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const data: Payment[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  amount: (i * 123) % 1000 + 10,
  status: ["success", "processing", "failed", "pending"][i % 4] as Payment["status"],
  email: `user${i + 1}@example.com`,
}))

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      let variant: PillVariant = 'neutral';
      if (status === 'success') variant = 'success';
      if (status === 'failed') variant = 'error';
      if (status === 'processing') variant = 'info';
      if (status === 'pending') variant = 'warning';
      
      return (
        <Pill variant={variant}>
          {status}
        </Pill>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-display text-transform-primary"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-display text-transform-primary">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="font-body text-transform-secondary"
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-body text-transform-secondary">View customer</DropdownMenuItem>
            <DropdownMenuItem className="font-body text-transform-secondary">View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataGridSandbox() {  const [borderRadius, setBorderRadius] = useState([12]);
  const [borderWidth, setBorderWidth] = useState([1]);
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/data-grid/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "DataGrid Structural Settings", type: "Docs Link", filePath: "zap/organisms/data-grid/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--data-grid-radius</span>
                  <span className="font-bold">{borderRadius[0]}px</span>
                </div>
                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--data-grid-border-width</span>
                  <span className="font-bold">{borderWidth[0]}px</span>
                </div>
                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="Data Grid"
      tier="L5 ORGANISM"
      status="Refactor Required"
      filePath="src/genesis/organisms/data-grid.tsx"
      importPath="@/genesis/organisms/data-grid"
      inspectorControls={inspectorControls}
      foundationInheritance={{
          colorTokens: ['--md-sys-color-surface-container', '--md-sys-color-surface-container-high'],
          typographyScales: ['--font-body', '--font-display']
      }}
      platformConstraints={{
          web: "Fluid width data tables with fixed headers.",
          mobile: "Horizontal scrolling required."
      }}
      foundationRules={[
          "Do not hardcode pixel widths for columns.",
          "Respect text casing rules."
      ]}
    >
      <div 
        className="w-full p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl overflow-hidden"
        style={{
          '--data-grid-radius': `${borderRadius[0]}px`,
          '--data-grid-border-width': `${borderWidth[0]}px`,
        } as React.CSSProperties}
      >
        <DataGrid columns={columns} data={data} searchKey="email" />
      </div>
    </ComponentSandboxTemplate>
  )
}

