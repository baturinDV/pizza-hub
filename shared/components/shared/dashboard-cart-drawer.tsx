'use client';

import { Button } from '@/shared/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet';
import { DashboardMenu } from '.';
import { cn } from '@/shared/lib/utils';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const DashboardCartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="flex flex-col h-full p-6md:p-8 bg-[#F4F1EE]">
                <div className={cn('flex flex-col h-full justify-between')}>
                    <SheetHeader>
                        <SheetTitle className="text-center font-extrabold mb-4 text-3xl md:text-4xl">
                            Панель администратора
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col flex-1 mb-8">
                        <DashboardMenu />
                    </div>

                    <SheetClose>
                        <Button className="w-full h-12 text-base flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Вернуться
                        </Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
};