'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../genesis/molecules/card';
import { Button } from '../../genesis/atoms/interactive/button';


// Standardized Mock for I18n Demonstration
export function I18nExample() {
  const [count, setCount] = React.useState(5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Internationalization Pattern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Basic Translation Hooks:</h3>
            <div className="bg-muted/30 p-3 rounded-lg border text-sm font-mono text-transform-tertiary leading-relaxed">
              const &#123; t &#125; = useTranslation();<br/>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              &lt;p&gt;&#123;t('common.welcome')&#125;&lt;/p&gt;
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              ZAP Design engine uses typesafe i18n keys by default.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pluralization & Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">
              You have <span className="text-primary font-bold">{count}</span> messages
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCount(Math.max(0, count - 1))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCount(count + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
