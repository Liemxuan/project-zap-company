import { BrandHeader } from "../components/brand-header";
import { AuthForm } from "../components/auth-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
        {/* Visual Identity Section */}
        <div className="hidden lg:flex flex-col flex-1 border-r border-outline-variant bg-surface-variant/30 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="font-bold text-2xl tracking-tighter text-on-surface">
                    ZAP INC<span className="text-primary">.</span>
                </div>
                <div className="space-y-4 max-w-md">
                    <h2 className="text-4xl font-bold tracking-tight text-on-surface leading-tight">
                        Secure access to Olympus Infrastructure.
                    </h2>
                    <p className="text-lg text-on-surface-variant">
                        Centralized authentication across all agent operations, point of sale terminals, and metric dashboards.
                    </p>
                </div>
            </div>
        </div>
        
        {/* Auth Section */}
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 w-full">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                <BrandHeader />
                <AuthForm />
            </div>
        </div>
    </div>
  );
}
