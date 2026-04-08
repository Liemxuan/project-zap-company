import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BrandHeader } from "../components/brand-header";
import { AuthForm } from "../components/auth-form";
import { AuthHeroPanel } from "../components/auth-hero-panel";

export default function HomePage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
        {/* Visual Identity Section — parallax hero */}
        <AuthHeroPanel />
        
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
