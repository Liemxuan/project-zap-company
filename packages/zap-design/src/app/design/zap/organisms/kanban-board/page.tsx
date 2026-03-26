"use client"

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { KanbanBoard, KanbanColumn, KanbanTask } from '../../../../../genesis/organisms/kanban-board';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';
const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: 'col-backlog', title: 'Backlog' },
  { id: 'col-todo', title: 'To Do' },
  { id: 'col-in-progress', title: 'In Progress' },
  { id: 'col-done', title: 'Done' },
];

const MOCK_AVATARS = [
  { name: 'Zeus Tom', avatarUrl: 'https://i.pravatar.cc/150?u=zeus' },
  { name: 'Spike Agent', avatarUrl: 'https://i.pravatar.cc/150?u=spike' },
  { name: 'Jerry Watchdog', avatarUrl: 'https://i.pravatar.cc/150?u=jerry' },
];

const MOCK_TITLES = ['Form', 'Alert', 'Accordion', 'Tabs', 'Pagination', 'Breadcrumb'];
const MOCK_PRIORITIES: KanbanTask['priority'][] = ['low', 'medium', 'high'];

const INITIAL_TASKS: KanbanTask[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `task-${i + 1}`,
  columnId: INITIAL_COLUMNS[i % INITIAL_COLUMNS.length].id,
  title: `Audit ${MOCK_TITLES[i % MOCK_TITLES.length]} component according to M3 constraints (Task ${i + 1})`,
  priority: MOCK_PRIORITIES[i % MOCK_PRIORITIES.length],
  assignee: i % 3 !== 0 ? MOCK_AVATARS[i % MOCK_AVATARS.length] : undefined,
}));

export default function KanbanBoardSandbox() {  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  
  const [colRadius, setColRadius] = useState([12]);
  const [colBorderWidth, setColBorderWidth] = useState([1]);
  const [taskRadius, setTaskRadius] = useState([8]);
  const [taskBorderWidth, setTaskBorderWidth] = useState([1]);
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/kanban-board/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "Kanban Structural Settings", type: "Docs Link", filePath: "zap/organisms/kanban-board/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--kanban-column-radius</span>
                  <span className="font-bold">{colRadius[0]}px</span>
                </div>
                <Slider value={colRadius} onValueChange={setColRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--kanban-column-border-width</span>
                  <span className="font-bold">{colBorderWidth[0]}px</span>
                </div>
                <Slider value={colBorderWidth} onValueChange={setColBorderWidth} min={0} max={8} step={1} className="w-full" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--kanban-task-radius</span>
                  <span className="font-bold">{taskRadius[0]}px</span>
                </div>
                <Slider value={taskRadius} onValueChange={setTaskRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground">
                  <span>--kanban-task-border-width</span>
                  <span className="font-bold">{taskBorderWidth[0]}px</span>
                </div>
                <Slider value={taskBorderWidth} onValueChange={setTaskBorderWidth} min={0} max={8} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="Kanban Board"
      tier="L5 ORGANISM"
      status="Beta"
      filePath="src/genesis/organisms/kanban-board.tsx"
      importPath="@/genesis/organisms/kanban-board"
      inspectorControls={inspectorControls}
      foundationInheritance={{
          colorTokens: ['--md-sys-color-surface-variant', '--md-sys-color-surface'],
          typographyScales: ['--font-body', '--font-display']
      }}
      platformConstraints={{
          web: "Fluid columns with horizontal overflow.",
          mobile: "Stacks or swipeable horizontal columns."
      }}
      foundationRules={[
          "Columns must construct cleanly and accept dropping across boundaries.",
          "Cards compose L3/L4 M3 semantic mappings."
      ]}
    >
      <div 
        className="w-full h-[600px] overflow-hidden p-8 relative bg-layer-panel shadow-sm border border-outline-variant rounded-xl"
        style={{
          '--kanban-column-radius': `${colRadius[0]}px`,
          '--kanban-column-border-width': `${colBorderWidth[0]}px`,
          '--kanban-task-radius': `${taskRadius[0]}px`,
          '--kanban-task-border-width': `${taskBorderWidth[0]}px`,
        } as React.CSSProperties}
      >
        <div className="absolute top-6 right-6 z-50">
            <Link href="/design/metro/kanban">
                <Button variant="flat" className="gap-2 px-3 py-1.5 text-xs shadow-[var(--md-sys-elevation-level3)] border border-primary/20">
                    <ExternalLink className="size-4" />
                    Open Full Page Template
                </Button>
            </Link>
        </div>
        <KanbanBoard 
          columns={INITIAL_COLUMNS} 
          tasks={tasks} 
          onTasksChange={setTasks}
        />
      </div>
    </ComponentSandboxTemplate>
  )
}
