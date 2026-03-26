'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LayoutContextProps {
    isSidebarCollapsed: boolean;
    sidebarWidth: number;
    isInspectorCollapsed: boolean;
    inspectorWidth: number;
    toggleSidebar: () => void;
    setSidebarWidth: (width: number) => void;
    toggleInspector: () => void;
    setInspectorWidth: (width: number) => void;
    setIsSidebarCollapsed: (collapsed: boolean) => void;
    setIsInspectorCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarWidth, setSidebarWidthState] = useState(240);
    const [isSidebarCollapsed, setIsSidebarCollapsedState] = useState(false);
    const [inspectorWidth, setInspectorWidthState] = useState(260);
    const [isInspectorCollapsed, setIsInspectorCollapsedState] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsedState(prev => {
            if (!prev) {
                // Collapsing
                setSidebarWidthState(64);
                return true;
            } else {
                // Expanding
                setSidebarWidthState(240);
                return false;
            }
        });
    }, []);

    const toggleInspector = useCallback(() => {
        setIsInspectorCollapsedState(prev => {
            if (!prev) {
                setInspectorWidthState(0);
                return true;
            } else {
                setInspectorWidthState(260);
                return false;
            }
        });
    }, []);

    return (
        <LayoutContext.Provider
            value={{
                isSidebarCollapsed,
                sidebarWidth,
                isInspectorCollapsed,
                inspectorWidth,
                toggleSidebar,
                setSidebarWidth: setSidebarWidthState,
                toggleInspector,
                setInspectorWidth: setInspectorWidthState,
                setIsSidebarCollapsed: setIsSidebarCollapsedState,
                setIsInspectorCollapsed: setIsInspectorCollapsedState
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
