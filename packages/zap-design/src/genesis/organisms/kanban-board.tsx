'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';
import { Button } from '../../genesis/atoms/interactive/button';
import { SearchInput } from '../../genesis/atoms/interactive/SearchInput';
import { Pill, PillVariant } from '../../genesis/atoms/status/pills';
import { Avatar, AvatarFallback, AvatarImage } from '../../genesis/atoms/interactive/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../genesis/molecules/dropdown-menu';
import { MoreVertical, Plus } from 'lucide-react';
import { ScrollArea, ScrollBar } from '../../genesis/molecules/scroll-area';

// --- Types ---

export type ColumnId = string;
export type TaskId = string;

export interface KanbanColumn {
  id: ColumnId;
  title: string;
}

export interface KanbanTask {
  id: TaskId;
  columnId: ColumnId;
  title: string;
  priority: 'high' | 'medium' | 'low';
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  tasks: KanbanTask[];
  onTasksChange?: (tasks: KanbanTask[]) => void;
  className?: string;
}

// --- Sortable Task Item Component ---

interface SortableTaskProps {
  task: KanbanTask;
  isDragging?: boolean;
}

function KanbanTaskCard({ task, isDragging }: SortableTaskProps & { isDragging?: boolean }) {
  const getPriorityVariant = (priority: string): PillVariant => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'info';
    }
  };

  const initials = task.assignee?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-[length:var(--kanban-task-radius,var(--radius-shape-sm))] bg-surface p-4 shadow-[var(--md-sys-elevation-level1)] ring-[length:var(--kanban-task-border-width,1px)] ring-outline-variant hover:shadow-[var(--md-sys-elevation-level2)] transition-all cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 ring-primary shadow-[var(--md-sys-elevation-level3)]'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Pill variant={getPriorityVariant(task.priority)}>{task.priority}</Pill>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4 text-on-surface-variant" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem>Assign User</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="font-body text-transform-secondary text-sm font-medium text-on-surface">
        {task.title}
      </p>

      {task.assignee && (
        <div className="mt-auto flex items-center justify-between pt-2">
          <Avatar className="h-6 w-6 ring-1 ring-outline shadow-sm">
            <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
            <AvatarFallback className="text-[10px] font-medium bg-primary-container text-on-primary-container">{initials}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}

function SortableTask({ task }: { task: KanbanTask }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <KanbanTaskCard task={task} isDragging={isDragging} />
    </div>
  );
}

// --- Sortable Column Component ---

interface SortableColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
}

function SortableColumn({ column, tasks }: SortableColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col rounded-[length:var(--kanban-column-radius,var(--radius-shape-md))] bg-surface-variant ring-[length:var(--kanban-column-border-width,1px)] ring-outline-variant/50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-transform-primary font-bold text-sm text-on-surface">
            {column.title}
          </h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-on-surface-variant ring-1 ring-outline-variant">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[length:var(--radius-shape-sm,8px)]">
          <Plus className="h-4 w-4 text-on-surface-variant" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-3 pb-4 min-h-[150px]">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
}

// --- Main Kanban Board Organism ---

export function KanbanBoard({ columns, tasks: initialTasks, onTasksChange, className }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const updateTasks = (updater: React.SetStateAction<KanbanTask[]>) => {
    const nextTasks = typeof updater === 'function' ? updater(tasks) : updater;
    setTasks(nextTasks);
    onTasksChange?.(nextTasks);
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(lowerQuery));
  }, [tasks, searchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    if (activeData?.type === 'Task') {
      setActiveTask(activeData.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column' || columns.some((col) => col.id === overId);

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      updateTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        
        // If they are in different columns, move the active task to the over task's column
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a Task over an empty space in a Column
    if (isActiveTask && isOverColumn) {
      updateTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        
        // Ensure we actually change the column ID
        if (newTasks[activeIndex].columnId !== overId) {
            newTasks[activeIndex].columnId = overId as string;
            // Move to the end of the target column
            return arrayMove(newTasks, activeIndex, newTasks.length - 1);
        }
        return newTasks;
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverTask) {
      updateTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        
        if (tasks[activeIndex].columnId === tasks[overIndex].columnId) {
          return arrayMove(tasks, activeIndex, overIndex);
        }
        return tasks;
      });
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <div className={cn('flex flex-col h-full w-full gap-6', className)}>
      {/* Kanban Toolbar */}
      <div className="flex items-center justify-between  px-1">
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Button className="font-display font-medium text-transform-primary gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Kanban Board Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <ScrollArea className="flex-1 w-full pb-4">
          <div className="flex h-full items-start gap-4 p-1">
            {columns.map((column) => (
              <SortableColumn
                key={column.id}
                column={column}
                tasks={filteredTasks.filter((task) => task.columnId === column.id)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Drag Overlay for smooth visual feedback */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <KanbanTaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
