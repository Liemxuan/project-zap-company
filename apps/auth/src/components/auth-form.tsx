"use client";

import { useState } from "react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { Input } from "zap-design/src/genesis/atoms/interactive/input";
import { Label } from "zap-design/src/genesis/atoms/interactive/label";
import { Checkbox } from "zap-design/src/genesis/atoms/interactive/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      toast.success("Authentication successful. Redirecting...");
      // Simulate redirect
      router.push("/dashboard"); 
    }, 1500);
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="admin@zap.inc" 
            required 
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-sm text-primary hover:underline hover:text-primary-active">
              Forgot password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm font-normal text-on-surface-variant cursor-pointer">
          Remember this device
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
}
