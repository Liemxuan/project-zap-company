import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../genesis/molecules/tabs';
import { Input } from '../../../../genesis/atoms/interactive/inputs';
import { Label } from '../../../../genesis/atoms/interactive/label';
import { Switch } from '../../../../genesis/atoms/interactive/switch';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../genesis/molecules/card';

export interface SettingsPaneProps {
    className?: string;
    defaultTab?: string;
}

export const SettingsPane: React.FC<SettingsPaneProps> = ({
    className = '',
    defaultTab = 'general'
}) => {
    return (
        <div className={`w-full max-w-4xl mx-auto flex flex-col gap-6 ${className}`}>
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your workspace priorities and agent behaviors.</p>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full flex flex-col md:flex-row gap-6">
                <TabsList className="flex flex-col h-auto bg-transparent items-start justify-start w-full md:w-48 space-y-1">
                    <TabsTrigger value="general" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted">General</TabsTrigger>
                    <TabsTrigger value="agents" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted">Agents & AI</TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted">Security (CSO)</TabsTrigger>
                    <TabsTrigger value="advanced" className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-muted">Advanced</TabsTrigger>
                </TabsList>

                <div className="flex-1 w-full relative min-h-[400px]">
                    <TabsContent value="general" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase">General Configuration</CardTitle>
                                <CardDescription>Basic settings for your Olympus workspace.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="workspaceName">Workspace Name</Label>
                                    <Input id="workspaceName" defaultValue="Olympus Prime" className="max-w-md" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Force M3 dark tokens globally.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-border pt-6">
                                <Button>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="agents" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase">Agent Swarm</CardTitle>
                                <CardDescription>Control Spike, Jerry, and Hydra team behaviors.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Autonomous Execution</Label>
                                        <p className="text-sm text-muted-foreground">Allow Spike to extract components without explicit approval.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">TRT Verification</Label>
                                        <p className="text-sm text-muted-foreground">Hydra team runs Test-Time Recursive Thinking before merge.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase overflow-hidden text-brand-red">Strict Borders</CardTitle>
                                <CardDescription>ZAP CSO perimeter rules.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Block Foreign CSS</Label>
                                        <p className="text-sm text-muted-foreground">Automatically strip non-M3 tokens on extraction.</p>
                                    </div>
                                    <Switch defaultChecked disabled />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">1-Hour Kill Switch</Label>
                                        <p className="text-sm text-muted-foreground">Force manual review every hour during mass extraction blasts.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="advanced" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <Card className="border-brand-red/30 shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold uppercase text-brand-red">Danger Zone</CardTitle>
                                <CardDescription>Irreversible destructive actions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between border border-brand-red/20 rounded-md p-4 bg-brand-red/5">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-brand-red font-bold">Purge Component Registry</Label>
                                        <p className="text-sm text-muted-foreground">Permanently delete all extracted L1-L7 components. Cannot be undone.</p>
                                    </div>
                                    <Button variant="destructive">Purge Database</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
