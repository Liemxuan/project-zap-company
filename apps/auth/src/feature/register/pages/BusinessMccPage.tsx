import { BusinessMccForm } from '../components/BusinessMccForm';

interface BusinessMccPageProps {
  merchantId: string;
  lang: string;
}

export function BusinessMccPage({ merchantId, lang }: BusinessMccPageProps) {
  return (
    <div className="min-h-screen bg-white flex items-start justify-center relative overflow-hidden">
      {/* Background layer effect - subtle gradient from top */}
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-on-surface/5 to-transparent opacity-30 pointer-events-none" />
      
      <div className="w-full h-full max-w-7xl mx-auto z-10">
        <BusinessMccForm merchantId={merchantId} lang={lang} />
      </div>
    </div>
  );
}
