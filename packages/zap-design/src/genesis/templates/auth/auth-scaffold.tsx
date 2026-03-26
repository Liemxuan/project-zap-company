import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../genesis/molecules/card';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { Label } from '../../../genesis/atoms/interactive/label';
import { Button } from '../../../genesis/atoms/interactive/button';

export interface AuthScaffoldProps {
    title?: string;
    description?: string;
    formType?: 'login' | 'register' | 'forgot-password';
}

export const AuthScaffold: React.FC<AuthScaffoldProps> = ({
    title = "Welcome back",
    description = "Enter your credentials to access the Olympus terminal.",
    formType = 'login'
}) => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-sm border-border shadow-sm">
                <CardHeader className="space-y-1">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-display text-transform-primary mb-2">
                        Z
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                    </div>
                    {formType !== 'forgot-password' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
                                    Forgot password?
                                </a>
                            </div>
                            <Input id="password" type="password" />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full">
                        {formType === 'login' ? 'Sign In' : formType === 'register' ? 'Create Account' : 'Send Reset Link'}
                    </Button>
                    <div className="text-center text-sm">
                        {formType === 'login' ? (
                            <span className="text-muted-foreground">
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Sign up</a>
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                Back to <a href="#" className="text-primary font-medium hover:underline">Sign in</a>
                            </span>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
