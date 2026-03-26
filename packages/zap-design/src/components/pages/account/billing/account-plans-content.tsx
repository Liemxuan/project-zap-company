'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Check, Zap, Rocket, Building2 } from 'lucide-react';

export function AccountPlansContent() {
  const plans = [
    {
      name: 'Startup',
      price: '0',
      description: 'Ideal for individual developers and small projects.',
      icon: Zap,
      features: ['Up to 5 Projects', 'Community Support', 'Basic Analytics'],
      current: false,
    },
    {
      name: 'Pro',
      price: '49',
      description: 'Perfect for growing teams and scaling applications.',
      icon: Rocket,
      features: ['Unlimited Projects', 'Priority Support', 'Advanced Analytics', 'Custom Domains'],
      current: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large-scale operations.',
      icon: Building2,
      features: ['Dedicated Support', 'SLA Guarantee', 'Custom Integrations', 'Advanced Security'],
      current: false,
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? 'border-primary ring-1 ring-primary' : ''}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-primary/10">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                {plan.popular && (
                  <Badge variant="success" className="uppercase text-[10px] font-black">Most Popular</Badge>
                )}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">${plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-sm text-muted-foreground">/ month</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.current ? 'outline' : 'primary'} 
                className="w-full font-bold uppercase text-xs"
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
