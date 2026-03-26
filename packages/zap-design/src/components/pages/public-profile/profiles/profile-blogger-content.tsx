'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { 
   
  MessageSquare, 
  ThumbsUp, 
  Share2, 
   
  Clock, 
  Hash, 
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Zap
} from 'lucide-react';

export function ProfileBloggerContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <Card className="bg-muted/5">
              <CardContent className="pt-6 flex flex-col items-center gap-1">
                 <span className="text-2xl font-black italic tracking-tighter">397</span>
                 <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Articles</span>
              </CardContent>
           </Card>
           <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 flex flex-col items-center gap-1">
                 <span className="text-2xl font-black italic tracking-tighter text-primary">8.2k</span>
                 <span className="text-[10px] uppercase font-black text-primary/70 tracking-widest">Upvotes</span>
              </CardContent>
           </Card>
        </div>

        <Card>
           <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest">Collaborate</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="text-xs text-muted-foreground leading-relaxed">Interested in guest posting or technical reviews? Let's connect.</p>
              <Button variant="primary" className="w-full uppercase font-black italic text-[10px] tracking-widest">Send Inquiry</Button>
           </CardContent>
        </Card>

        <Card>
           <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest"><Hash size={14} className="inline mr-1"/> Trending Topics</CardTitle></CardHeader>
           <CardContent className="flex flex-wrap gap-2">
              {['Security', 'Automation', 'M3 Design', 'ZAP OS', 'Fleet Scaling'].map(t => (
                 <Badge key={t} variant="secondary" className="px-3 py-1 bg-muted/30 border-0 hover:bg-primary/5 cursor-pointer text-[10px] font-bold uppercase transition-colors">{t}</Badge>
              ))}
           </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Latest Posts</h2>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase"><Clock className="w-3 h-3 mr-1"/> Newest</Button>
                 <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase"><ThumbsUp className="w-3 h-3 mr-1"/> Popular</Button>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { title: 'The Future of Agentic Infrastructure', cats: ['Architecture', 'Scaling'], date: '2 hours ago', likes: '1.2k', comments: '42' },
                { title: 'Standardizing React 19 Components', cats: ['Frontend', 'M3'], date: 'Yesterday', likes: '894', comments: '15' }
              ].map((post, idx) => (
                <Card key={idx} className="group hover:border-primary/50 transition-all cursor-pointer">
                   <CardContent className="pt-6 pb-6 space-y-4">
                      <div className="flex items-center gap-2">
                         {post.cats.map(c => <Badge key={c} variant="primary" className="text-[8px] font-black uppercase italic tracking-widest opacity-80">{c}</Badge>)}
                         <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">• {post.date}</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors italic">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                         Exploring the convergence between scout agents and real-time DOM reconciliation in modern web frameworks...
                      </p>
                      <div className="flex items-center justify-between pt-2">
                         <div className="flex gap-5">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors"><ThumbsUp size={14}/> {post.likes}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground"><MessageSquare size={14}/> {post.comments}</span>
                         </div>
                         <Button variant="ghost" size="sm" mode="icon" className="group-hover:text-primary"><Share2 size={16}/></Button>
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>
           
           <Button variant="ghost" className="w-full uppercase font-black italic tracking-widest text-[10px] py-4 h-auto border-dashed border hover:bg-muted/5">
              Load More Insights
           </Button>
        </div>
      </div>
    </div>
  );
}
