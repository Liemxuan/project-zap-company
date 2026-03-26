'use client';

import React from 'react';
import { SettingsLayout } from '../../../zap/layout/SettingsLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../genesis/molecules/card';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { Label } from '../../../genesis/atoms/interactive/label';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Switch } from '../../../genesis/atoms/interactive/switch';
import { Separator } from '../../../genesis/atoms/interactive/separator';

// --- L4 Molecule: The Sidebar Navigation ---
const SettingsSidebar = () => (
    <div className="flex flex-col gap-1 w-full">
        <h4 className="font-display text-transform-primary text-sm font-bold text-muted-foreground mb-4 tracking-wider">Configuration</h4>
        <button className="text-left px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-semibold text-sm">Profile Details</button>
        <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-muted-foreground text-sm transition-colors">Authentication</button>
        <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-muted-foreground text-sm transition-colors">Notifications</button>
        <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-muted-foreground text-sm transition-colors">API Keys</button>
        
        <Separator className="my-4" />
        
        <h4 className="font-display text-transform-primary text-sm font-bold text-muted-foreground mb-4 tracking-wider">Danger Zone</h4>
        <button className="text-left px-4 py-2 rounded-md hover:bg-destructive/10 text-destructive text-sm transition-colors">Delete Account</button>
    </div>
);

export default function SettingsPrototypePage() {

    // --- L7 Assembly: Injecting L3 Atoms and L4 Molecules into the L6 Layout ---
    return (
        <SettingsLayout sidebar={<SettingsSidebar />}>
            {/* L5 Organism / L4 Molecule: Profile Form Block */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-display text-transform-primary text-primary">Public Profile</CardTitle>
                    <CardDescription>This information will be displayed publicly so be careful what you share.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
                                zap.com/
                            </span>
                            <Input id="username" defaultValue="zeus_tom" className="rounded-l-none" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biography</Label>
                        <textarea 
                            id="bio" 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="I am the Chief Security Officer..."
                            defaultValue="Chief Security Officer at ZAP Inc. Keeping the walls up and the infrastructure safe."
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-end">
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>

            {/* L5 Organism / L4 Molecule: Security Toggles Block */}
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-display text-transform-primary text-primary">Security Preferences</CardTitle>
                    <CardDescription>Manage your security posture and multi-factor authentication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="2fa" className="text-base">Two-Factor Authentication (2FA)</Label>
                            <span className="text-sm text-muted-foreground">Require a hardware key or authenticator app when logging in.</span>
                        </div>
                        <Switch id="2fa" defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="alerts" className="text-base">Unrecognized Login Alerts</Label>
                            <span className="text-sm text-muted-foreground">Get notified via email if we detect a login from a new device.</span>
                        </div>
                        <Switch id="alerts" defaultChecked />
                    </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-end">
                    <Button variant="outline">View Audit Logs</Button>
                </CardFooter>
            </Card>
        </SettingsLayout>
    );
}
