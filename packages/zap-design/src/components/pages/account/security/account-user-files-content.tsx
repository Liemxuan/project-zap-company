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
import { FileText, MoreVertical, Download, ExternalLink } from 'lucide-react';

export function AccountUserFilesContent() {
  const files = [
    { name: 'Project-pitch.pdf', size: '4.7 MB', date: '26 Sep 2024', type: 'PDF' },
    { name: 'Report-v1.docx', size: '2.3 MB', date: '01 Oct 2024', type: 'DOC' },
    { name: 'Framework-App.js', size: '0.8 MB', date: '17 Oct 2024', type: 'JS' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">My Files & Documents</CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {files.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-xl bg-muted/50 border border-border/50 shadow-sm group-hover:bg-muted group-hover:border-primary/20 transition-all">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight">{file.name}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] py-0.5 px-1.5 bg-muted rounded font-black text-muted-foreground">{file.type}</span>
                     <span className="text-[10px] text-muted-foreground font-medium">{file.size} • {file.date}</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="sm" mode="icon" className="hover:text-primary">
                  <Download size={14} />
               </Button>
               <Button variant="ghost" size="sm" mode="icon">
                  <ExternalLink size={14} />
               </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase font-black text-muted-foreground tracking-tighter hover:text-primary">
          View Storage Vault
        </Button>
      </CardFooter>
    </Card>
  );
}
