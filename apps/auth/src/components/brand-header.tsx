import { ShieldCheck } from 'lucide-react';

export function BrandHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 mb-8">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20">
        <ShieldCheck className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">ZAP Vault</h1>
        <p className="text-sm text-on-surface-variant">Master Authentication Gateway</p>
      </div>
    </div>
  );
}
