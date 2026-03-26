import { create } from 'zustand';
import { WorkspaceEntry, WORKSPACE_REGISTRY } from '../config/workspace-registry';

interface WorkspaceStore {
  activeWorkspaceId: string;
  setActiveWorkspace: (id: string) => void;
  getActiveWorkspace: () => WorkspaceEntry | undefined;
}

const getInitialWorkspaceId = () => {
    if (typeof window !== 'undefined') {
        const port = parseInt(window.location.port, 10);
        const ws = WORKSPACE_REGISTRY.find(w => w.port === port);
        if (ws) return ws.id;
    }
    return 'zap-design'; // Default boot context for SSR and proxy fallbacks
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  activeWorkspaceId: getInitialWorkspaceId(),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  getActiveWorkspace: () => WORKSPACE_REGISTRY.find(w => w.id === get().activeWorkspaceId),
}));
