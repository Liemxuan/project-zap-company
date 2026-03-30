'use client';

import React, { useState } from 'react';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Input } from '../../../genesis/atoms/interactive/inputs';
import { Heading } from '../../../genesis/atoms/typography/headings';
import { Text } from '../../../genesis/atoms/typography/text';
import { Label } from '../../../genesis/atoms/typography/label';

export default function TenantOnboardingPage() {
  const [tenantName, setTenantName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('Commerce');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // STRICT UTC ADHERENCE GUARANTEE
    // ISO 8601 formatting represents absolute UTC when generated natively without offsets.
    const creationTimestamp = new Date().toISOString(); 

    const payload = {
      tenantName,
      email,
      sector,
      created_at: creationTimestamp, // Explicitly pass the UTC standard
    };

    console.log('[ONBOARDING PAYLOAD] Submitting strictly UTC mapped record:', payload);

    // Simulated API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Tenant ${tenantName} formally onboarded with absolute UTC timestamp: ${creationTimestamp}`);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-[var(--md-sys-color-surface)]">
      <div className="w-full max-w-lg p-8 rounded-xl shadow-sm border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]">
        <Heading level={1} className="mb-2 text-[var(--md-sys-color-on-surface)] text-center">
          Tenant Onboarding
        </Heading>
        <Text size="body-small" className="text-center text-[var(--md-sys-color-on-surface-variant)] mb-8">
          Provision a new enterprise workspace entity into the ZAP-OS B2B ecosystem.
        </Text>

        <form onSubmit={handleOnboard} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[var(--md-sys-color-on-surface)]">Tenant (Business) Name</Label>
            <Input 
              value={tenantName} 
              onChange={(e) => setTenantName(e.target.value)} 
              placeholder="e.g., GStack Corp" 
              required
              className="bg-[var(--md-sys-color-surface)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--md-sys-color-on-surface)]">Administrator Email</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@gstack.co" 
              required 
              className="bg-[var(--md-sys-color-surface)]"
            />
          </div>
          
          <div className="space-y-2">
             <Label className="text-[var(--md-sys-color-on-surface)]">B2B Sector</Label>
             <select 
               title="B2B Sector"
               value={sector}
               onChange={(e) => setSector(e.target.value)}
               className="flex h-10 w-full rounded-md border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] px-3 py-2 text-[length:var(--type-label-large-desktop,14px)] text-[var(--md-sys-color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-transparent"
             >
                <option value="Hospitality">Hospitality</option>
                <option value="F&B">Food & Beverage (F&B)</option>
                <option value="Commerce">Commerce / Retail</option>
                <option value="Professional">Professional Services</option>
                <option value="Beauty">Beauty / Wellness</option>
             </select>
          </div>

          <Button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90 transition-opacity"
            variant="primary"
          >
            {isSubmitting ? 'Provisioning Environment...' : 'Provision Tenant Namespace'}
          </Button>

          <Text size="label-small" className="text-center text-[var(--md-sys-color-on-surface-variant)] mt-4">
            * All provisions are metered strictly in absolute UTC.
          </Text>
        </form>
      </div>
    </div>
  );
}
