'use client';


import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/components/ui/sheet'; 
import { DashboardMenu } from '.';
import { cn } from '@/shared/lib/utils';
import React, { useState } from 'react'; // Импорт useState 
import { ArrowLeft } from 'lucide-react';
import { Button, DialogDescription } from '@/shared/components';

export const DashboardCartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openSheet = () => {
        setIsOpen(true);
    };

    const closeSheet = () => {
        setIsOpen(false);
    };

    return (
     <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div onClick={openSheet}>
                {children} {/* Теперь children не обязательно должен быть внутри SheetTrigger */}
            </div>
            <SheetContent className="flex flex-col h-full p-6 md:p-8 bg-[#F4F1EE]">
            <div className={cn('flex flex-col h-full justify-between')}>
                    <SheetHeader>
                        <SheetTitle className="text-center font-extrabold mb-4 text-3xl md:text-4xl">
                            Панель администратора
                        </SheetTitle>
                        <SheetDescription className="sr-only">
                            Панель управления для администраторов
                        </SheetDescription>
                    </SheetHeader>


                    <div className="flex flex-col flex-1 mb-8">
                        <DashboardMenu onSelect={closeSheet} /> {/* Передаем метод закрытия */}
                    </div>

                    <SheetClose asChild>
                        <button 
                            className="w-full h-12 text-base flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            onClick={closeSheet}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                            <span>Вернуться</span>
                        </button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
};
