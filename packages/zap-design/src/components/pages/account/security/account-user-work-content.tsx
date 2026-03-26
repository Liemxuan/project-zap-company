'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Switch } from '../../../../genesis/atoms/interactive/switch';
import { Label } from '../../../../genesis/atoms/interactive/label';
import {   DollarSign, Languages, SquarePen } from 'lucide-react';

export function AccountUserWorkContent() {
  const skills = ['Web Design', 'Code Review', 'noCode', 'UX', 'Figma', 'Webflow', 'AI', 'Management'];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Work Portfolio</CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-[10px] uppercase font-black text-green-500">Available now</Label>
            <Switch defaultChecked size="sm" />
          </div>
        </div>
        <Button variant="ghost" size="sm" mode="icon">
          <SquarePen className="w-4 h-4 text-primary" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
             <div className="p-2 rounded-lg bg-muted/50">
                <Languages className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Languages</p>
                <p className="text-sm font-medium">English <span className="text-muted-foreground">(Native)</span></p>
                <p className="text-sm font-medium">Vietnamese <span className="text-muted-foreground">(Intermediate)</span></p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <div className="p-2 rounded-lg bg-muted/50">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Hourly Rate</p>
                <p className="text-sm font-medium">$150 / hour</p>
             </div>
          </div>
        </div>

        <div className="space-y-2">
           <p className="text-[10px] uppercase font-bold text-muted-foreground">Verified Skills</p>
           <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-muted/50 border-0 hover:bg-primary/10 transition-colors uppercase text-[10px] font-bold">
                  {skill}
                </Badge>
              ))}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
