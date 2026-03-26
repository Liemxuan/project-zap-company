'use client';

import React from 'react';
import { Button } from '../../genesis/atoms/interactive/button';
import { Card } from '../../genesis/molecules/card';
import { Input } from '../../genesis/atoms/interactive/inputs';
import { Label } from '../../genesis/atoms/interactive/label';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { Separator } from '../../genesis/atoms/interactive/separator';
import { Avatar, AvatarImage } from '../../genesis/atoms/interactive/avatar';
import { ShieldCheck, ArrowRight, Github, Mail } from 'lucide-react';

export function AuthScaffold() {
  return (
    <div className="w-full flex items-center justify-center min-h-[800px] bg-surface-container py-12 px-4 sm:px-6 lg:px-8">
      <Card className="flex flex-col md:flex-row w-full max-w-5xl rounded-[length:var(--auth-scaffold-radius,var(--radius-shape-xl))] overflow-hidden shadow-[var(--md-sys-elevation-level3)] border-outline-variant bg-surface border-[length:var(--auth-scaffold-border-width,1px)]">
        
        {/* Left Side: Branding / Identity (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-5/12 bg-primary/5 border-r border-outline-variant p-10 flex-col justify-between relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="font-display font-semibold text-headlineSmall text-transform-primary text-on-surface">
                ZAP Engine
              </span>
            </div>
            
            <h2 className="font-display font-bold text-headlineLarge text-transform-primary text-on-surface leading-tight mt-12">
              Secure.<br />
              Scalable.<br />
              Swarm-Ready.
            </h2>
            <p className="font-body text-bodyLarge text-transform-secondary text-on-surface-variant mt-6 max-w-sm">
              Authenticate via the central gateway to access your local agent nodes, fleet telemetry, and automated security pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Avatar key={i} className="inline-block h-8 w-8 rounded-[length:var(--radius-shape-full)] ring-2 ring-surface shadow-sm">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                </Avatar>
              ))}
            </div>
            <p className="font-body text-bodySmall text-transform-secondary text-on-surface-variant">
              Join 1,200+ active agents
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            
            {/* Mobile Header (Only visible on small screens) */}
            <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="font-display font-semibold text-headlineSmall text-transform-primary text-on-surface">
                ZAP Engine
              </span>
            </div>

            <div className="mb-8">
              <h1 className="font-display font-bold text-headlineMedium text-transform-primary text-on-surface">
                Welcome back
              </h1>
              <p className="font-body text-bodyMedium text-transform-secondary text-on-surface-variant mt-2">
                Enter your credentials to access the deployment bay.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-display text-bodyMedium font-medium text-transform-primary text-on-surface">
                    Email address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="zeus@zap.dev" 
                    required 
                    className="font-body text-bodyLarge text-on-surface h-12 border-outline-variant focus-visible:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-display text-bodyMedium font-medium text-transform-primary text-on-surface">
                      Password
                    </Label>
                    <a href="#" className="font-body text-bodySmall font-medium text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="font-body text-bodyLarge h-12 border-outline-variant focus-visible:ring-primary/20 tracking-widest"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="font-body text-bodyMedium font-medium leading-none text-transform-secondary text-on-surface-variant peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Keep me logged into this node
                </label>
              </div>

              <Button className="w-full h-12 font-display text-titleMedium text-transform-primary group">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-outline-variant" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-on-surface-variant font-display text-transform-primary">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-11 font-body text-bodyMedium text-on-surface border-outline-variant hover:bg-surface-variant">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="h-11 font-body text-bodyMedium text-on-surface border-outline-variant hover:bg-surface-variant">
                  <Mail className="mr-2 h-4 w-4" />
                  SSO
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                Don&apos;t have an access token?{' '}
                <a href="#" className="font-display font-medium text-primary hover:text-primary/80 transition-colors">
                  Request authorization
                </a>
              </p>
            </div>
            
          </div>
        </div>
      </Card>
    </div>
  );
}
