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
import { Label } from '../../../../genesis/atoms/interactive/label';
import { Switch } from '../../../../genesis/atoms/interactive/switch';
import { 
   
   
   
  Zap, 
   
  MessageSquare, 
  UserPlus, 
  
  
  Rocket,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Truck
} from 'lucide-react';

export function ProfileActivityContent() {
  const years = [2026, 2025, 2024, 2023];
  const [activeYear, setActiveYear] = React.useState(2026);

  const events = [
    { type: 'Update', title: 'Galactic Infrastructure Update', meta: 'Mar 11, 2026 • 2:00 PM', icon: Zap, color: 'text-amber-500' },
    { type: 'Interview', title: 'CSO Security Audit Session', meta: 'Mar 09, 2026 • 10:30 AM', icon: UserPlus, color: 'text-blue-500' },
    { type: 'Project', title: 'Olympus Sync v3.3 Deployed', meta: 'Mar 05, 2026 • 9:15 PM', icon: Rocket, color: 'text-green-500' },
    { type: 'Message', title: 'Community Feedback Loop', meta: 'Feb 28, 2026 • 4:20 PM', icon: MessageSquare, color: 'text-rose-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="grow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black italic tracking-tighter uppercase italic">Operational Logs</CardTitle>
          <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
             <Label className="text-[10px] uppercase font-black text-muted-foreground italic">Live Sync</Label>
             <Switch defaultChecked size="sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-10">
          <div className="relative border-l-2 border-muted pl-8 space-y-10 py-2 ml-4">
             {events.map((event, idx) => (
               <div key={idx} className="relative group transition-all">
                  <div className={`absolute -left-[45px] top-0 p-3 rounded-full bg-layer-dialog border-2 shadow-sm group-hover:scale-110 transition-transform ${event.color}`}>
                     <event.icon size={20} />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[8px] font-black uppercase italic tracking-widest">{event.type}</Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">{event.meta}</span>
                     </div>
                     <h3 className="text-base font-bold tracking-tight group-hover:text-primary transition-colors cursor-pointer">{event.title}</h3>
                     <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                        Activity logs for {event.title} have been processed and synchronized with the master registry.
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
        <CardFooter className="py-4 justify-center bg-muted/10 border-t">
           <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black hover:text-primary">Download Archive Logs</Button>
        </CardFooter>
      </Card>

      <div className="w-full md:w-32 flex flex-col gap-2">
         {years.map(year => (
           <Button 
             key={year} 
             variant={year === activeYear ? 'primary' : 'outline'} 
             size="sm"
             onClick={() => setActiveYear(year)}
             className={`font-black italic transition-all ${year === activeYear ? 'scale-105 shadow-md' : 'opacity-60 hover:opacity-100'}`}
           >
             {year}
           </Button>
         ))}
      </div>
    </div>
  );
}
