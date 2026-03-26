import { create } from 'zustand';
import { WorkspaceEntry, WORKSPACE_REGISTRY } from '../config/workspace-registry';

interface WorkspaceStore {
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
  getActiveWorkspace: () => WorkspaceEntry | undefined;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  activeWorkspaceId: 'zap-design', // Default boot context
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  getActiveWorkspace: () => WORKSPACE_REGISTRY.find(w => w.id === get().activeWorkspaceId),
}));
