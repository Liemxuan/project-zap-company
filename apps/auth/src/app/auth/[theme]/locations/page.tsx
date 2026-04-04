'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTheme, type AppTheme } from 'zap-design/src/components/ThemeContext';
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { LocationPage } from '@/feature/location/pages/LocationPage';

export default function AuthLocationsPage() {
  const params = useParams();
  const { theme: appTheme, setTheme } = useTheme();

  const theme = params.theme as string;

  useEffect(() => {
    if (theme) {
      setTheme(theme as AppTheme);
    }
  }, [theme, setTheme]);

  return (
    <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ThemeHeader
          title="locations assembly"
          breadcrumb="zap inc. / management / assembly"
          badge="verified"
          liveIndicator={true}
          showBackground={false}
        />

        {/* Table Content */}
        <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-16 lg:px-24 pb-24 flex flex-col relative z-0 bg-white">
          <LocationPage />
        </div>
      </div>
    </div>
  );
}
