'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';

import { Upload, FileSpreadsheet } from 'lucide-react';

export function AccountImportMembersContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Import Members</h1>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="border-2 border-dashed rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="size-16 rounded-full bg-muted/30 mx-auto flex items-center justify-center group-hover:bg-primary/5 transition-colors"><Upload size={28} className="text-muted-foreground group-hover:text-primary" /></div>
            <div><h3 className="text-sm font-bold">Drop your CSV here</h3><p className="text-xs text-muted-foreground">or click to browse files</p></div>
            <p className="text-[10px] text-muted-foreground uppercase">Supports: CSV, XLSX • Max 10MB</p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <FileSpreadsheet size={18} className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">Download our <Button variant="ghost" size="sm" className="text-blue-500 underline px-0 h-auto">template CSV</Button> to get started.</p>
          </div>
          <Button variant="primary" className="w-full h-12 font-black italic uppercase text-xs tracking-widest" disabled>Import Members</Button>
        </CardContent>
      </Card>
    </div>
  );
}
