'use client';

import React from 'react';
import { Card, CardHeader, CardTable } from '../../../../../genesis/molecules/card';
import { ScrollArea, ScrollBar } from '../../../../../genesis/molecules/scroll-area';

const PermissionList = () => {
  return (
    <>
      <Card>
        <CardHeader className="py-5">
          <h2 className="text-lg font-semibold">Permissions</h2>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              Permission list placeholder. DataGrid component is missing.
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
      </Card>
    </>
  );
};

export default PermissionList;
