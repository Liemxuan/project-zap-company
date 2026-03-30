import React from 'react';
import { MerchantCanvas } from 'zap-design/src/genesis/organisms/merchant-workspace-layout';
import { MetroHeader } from 'zap-design/src/genesis/molecules/layout/MetroHeader';

export default function StoreBuilderWorkspace() {
  return (
    <MerchantCanvas>
      <div className="w-full max-w-7xl mx-auto mb-8">
        <MetroHeader 
          breadcrumb="Store Building / ZAP Design Engine"
          title="Claw Prompt"
          badge={null}
        />
      </div>
      <div className="w-full max-w-7xl mx-auto h-[600px] border border-dashed border-border flex items-center justify-center rounded-[length:var(--layer-2-border-radius)] text-muted-foreground">
        Store Builder Implementation Layer
      </div>
    </MerchantCanvas>
  );
}
