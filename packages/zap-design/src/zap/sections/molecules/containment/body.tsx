'use client';

import React from 'react';
import { CardsSection } from './CardsSection';
import { DialogsSection } from './DialogsSection';

export { CardUserMini } from './CardsSection';

export const MoleculeContainmentBody = () => {
    return (
        <div className="max-w-[1080px] w-full mx-auto pb-20">
            <div className="space-y-12">
                <CardsSection />
                <DialogsSection />
            </div>
        </div>
    );
};
