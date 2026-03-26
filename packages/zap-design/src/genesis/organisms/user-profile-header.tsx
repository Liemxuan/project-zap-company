'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../genesis/atoms/interactive/avatar';
import { Button } from '../../genesis/atoms/interactive/button';
import { Badge } from '../../genesis/atoms/interactive/badge';
import { Tabs, TabsList, TabsTrigger } from '../../genesis/molecules/tabs';
import { Settings, Share, ShieldCheck, MapPin, Calendar, Mail } from 'lucide-react';

export function UserProfileHeader() {
  return (
    <div className="w-full flex justify-center py-10 px-4 md:px-8 bg-surface">
      <div className="w-full max-w-5xl bg-surface-container rounded-[length:var(--profile-header-radius,var(--radius-shape-xl))] overflow-hidden shadow-[var(--md-sys-elevation-level2)] border border-outline-variant border-[length:var(--profile-header-border-width,1px)]">
        
        {/* Cover Image Area */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/30 via-primary/10 to-surface-variant relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" size="sm" className="bg-surface/80 backdrop-blur-md border-outline-variant font-display text-transform-primary shadow-sm hover:bg-surface">
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="bg-surface/80 backdrop-blur-md border-outline-variant font-display text-transform-primary shadow-sm hover:bg-surface">
              <Settings className="h-4 w-4 mr-2" /> Edit Cover
            </Button>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="relative px-6 md:px-10 pb-6">
          
          {/* Masthead Header (Avatar + Action Buttons) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 md:-mt-20 mb-6 gap-4">
            {/* Avatar & Verification block */}
            <div className="flex flex-col gap-3">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32 border-4 border-surface shadow-[var(--md-sys-elevation-level3)] bg-surface-container-high rounded-[length:var(--profile-header-avatar-radius,var(--radius-shape-full))]">
                  <AvatarImage src="https://i.pravatar.cc/300" alt="@zeustom" />
                  <AvatarFallback className="font-display text-headlineLarge text-transform-primary bg-primary/20 text-primary">ZT</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 bg-surface rounded-full p-1 shadow-sm border border-outline-variant">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Core Actions */}
            <div className="flex items-center gap-3 md:pb-2">
              <Button variant="outline" className="font-display text-transform-primary border-outline-variant bg-surface-variant/50">
                Message
              </Button>
              <Button className="font-display text-transform-primary shadow-[var(--md-sys-elevation-level1)]">
                Follow Back
              </Button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display font-bold text-displaySmall text-transform-primary text-on-surface tracking-tight">
                  Zeus Tom
                </h1>
                <Badge variant="outline" size="sm" className="shadow-none border border-outline-variant">Admin</Badge>
                <Badge variant="success" size="sm" className="shadow-none bg-success/10 text-success border border-success/20">Online</Badge>
              </div>
              <h2 className="font-body text-titleMedium text-transform-secondary text-on-surface-variant font-medium">
                @zeustom • Chief Security Officer
              </h2>
            </div>
            
            <p className="font-body text-bodyLarge text-transform-secondary text-on-surface max-w-2xl leading-relaxed">
              Leading infrastructure defense, zero-trust network protocols, and agentic swarm architecture for the ZAP Engine. Defending the perimeter and scaling the fleet.
            </p>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <MapPin className="h-4 w-4 opacity-70" />
                <span className="font-body text-bodyMedium text-transform-secondary">Ho Chi Minh City, VN</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Mail className="h-4 w-4 opacity-70" />
                <span className="font-body text-bodyMedium text-transform-secondary">zeus@zap.dev</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Calendar className="h-4 w-4 opacity-70" />
                <span className="font-body text-bodyMedium text-transform-secondary">Joined March 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Border-top for separation) */}
        <div className="px-6 md:px-10 border-t border-outline-variant bg-surface/50">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start rounded-none border-b-0 shadow-none">
              <TabsTrigger 
                value="overview" 
                className="font-display text-titleSmall text-transform-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-4 px-1"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="font-display text-titleSmall text-transform-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-4 px-1"
              >
                Security & Access
              </TabsTrigger>
              <TabsTrigger 
                value="fleet" 
                className="font-display text-titleSmall text-transform-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-4 px-1"
              >
                Fleet Nodes
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="font-display text-titleSmall text-transform-primary rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-4 px-1"
              >
                Activity Log
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
      </div>
    </div>
  );
}
