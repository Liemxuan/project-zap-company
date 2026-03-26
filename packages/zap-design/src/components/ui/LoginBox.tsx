import React from 'react';

/**
 * Shared Login Box mapped to ZAP-Auth
 * Used across the POS, Kiosk, and Portal endpoints to provide universal SSO.
 */
export const LoginBox = ({ 
  appDomain, 
  onLogin 
}: { 
  appDomain: 'POS' | 'Kiosk' | 'Portal', 
  onLogin: () => void 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface border border-outline rounded-3xl shadow-elevation-3">
      <div className="text-center mb-6">
        <h2 className="text-display-sm text-on-surface mb-2 font-bold uppercase tracking-tight">ZAP Empire</h2>
        <p className="text-title-medium text-on-surface-variant">Sign in to {appDomain}</p>
      </div>
      
      <button 
        onClick={onLogin}
        className="w-full bg-primary text-on-primary py-3 px-6 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-elevation-1"
      >
        Authenticate via SSO
      </button>
      
      <p className="mt-4 text-body-small text-on-surface-variant text-center max-w-xs">
        Secure Handshake via <code>@olympus/zap-auth</code>
      </p>
    </div>
  );
};
