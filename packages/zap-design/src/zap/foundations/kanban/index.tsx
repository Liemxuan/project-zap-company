'use client';

import React, { useState } from 'react';
import { PanelLeft, Search, Bell, ChevronDown } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Input as GenesisInput } from '../../../genesis/atoms/interactive/inputs';
import { KanbanBoard, KanbanColumn, KanbanTask } from '../../../genesis/organisms/kanban-board';
import { AppShell } from '../../../zap/layout/AppShell';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';

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

const MOCK_TITLES = ['Audit Foundation', 'Build Shell', 'Fix L1 Bleed', 'Update Dialog', 'Wire Nav', 'Refactor Inputs'];
const MOCK_PRIORITIES: KanbanTask['priority'][] = ['low', 'medium', 'high'];

const INITIAL_TASKS: KanbanTask[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `task-${i + 1}`,
  columnId: INITIAL_COLUMNS[i % INITIAL_COLUMNS.length].id,
  title: `${MOCK_TITLES[i % MOCK_TITLES.length]} (Task ${i + 1})`,
  priority: MOCK_PRIORITIES[i % MOCK_PRIORITIES.length],
  assignee: i % 3 !== 0 ? MOCK_AVATARS[i % MOCK_AVATARS.length] : undefined,
}));

export default function MetroKanbanPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);

    return (
        <AppShell>
        <div className="flex h-screen w-full bg-surface font-body text-on-surface text-transform-secondary overflow-hidden">
            {/* LEFT SIDEBAR */}
            {sidebarOpen && (
                <aside className="w-[280px] bg-surface-container-low border-r border-border flex flex-col flex-shrink-0 transition-all duration-300">
                    <div className="h-14 border-b border-border flex items-center flex-shrink-0 justify-between px-4 w-full">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-titleMedium text-on-surface text-transform-primary truncate">ZAP OS</span>
                        </div>
                        <GenesisButton
                            visualStyle="ghost" variant="flat"
                            className="text-on-surface-variant hover:text-on-surface"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <PanelLeft className="size-5" />
                        </GenesisButton>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto p-4 flex flex-col gap-2">
                        <div className="font-display text-transform-primary text-labelLarge text-on-surface-variant text-transform-secondary py-2">Nav Components</div>
                        <div className="bg-surface-container-highest h-10 rounded-btn w-full animate-pulse" />
                        <div className="bg-surface-container-highest h-10 rounded-btn w-full animate-pulse" />
                    </div>
                </aside>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col bg-surface-container-lowest min-w-0">
                {/* HEADER */}
                <ThemeHeader
                    title={
                        <div className="flex items-center gap-2 -ml-2">
                            {!sidebarOpen && (
                                <GenesisButton
                                    visualStyle="ghost" variant="flat"
                                    className="text-on-surface-variant hover:text-on-surface"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <PanelLeft className="size-5" />
                                </GenesisButton>
                            )}
                            <span className="font-display text-headlineSmall text-on-surface text-transform-primary ml-1">Project Board</span>
                        </div>
                    }
                    breadcrumb={`Zap Design Engine / Foundations`}
                    badge="Interactive Component"
                    rightSlot={
                        <div className="flex items-center gap-4">
                             <div className="relative hidden md:flex items-center">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-on-surface-variant" />
                                <GenesisInput
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-8 w-[200px] bg-surface-container border-border"
                                />
                            </div>
                            <GenesisButton visualStyle="ghost" variant="flat" className="text-on-surface-variant hover:text-on-surface">
                                <Bell className="size-5" />
                            </GenesisButton>

                            <GenesisButton visualStyle="outline" variant="flat" className="gap-2 border-border shadow-sm">
                                <span className="font-body text-labelLarge text-on-surface text-transform-secondary hidden sm:inline-block">Admin</span>
                                <ChevronDown className="size-4 text-on-surface-variant" />
                            </GenesisButton>
                        </div>
                    }
                    showBackground={false}
                />

                {/* WORKSPACE */}
                <div className="flex-1 w-full overflow-hidden p-6 bg-surface-container-lowest">
                    <KanbanBoard 
                        columns={INITIAL_COLUMNS} 
                        tasks={tasks} 
                        onTasksChange={setTasks}
                    />
                </div>
            </main>
        </div>
        </AppShell>
    );
}
