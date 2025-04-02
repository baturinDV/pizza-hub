
import React, { useEffect, useState } from 'react';
import { ArrowRight, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '../ui';
import { DashboardCartDrawer } from '.';


interface Props {
  className?: string;
}

export const DashboardButton: React.FC<Props> = ({ className }) => {
  return (
    <DashboardCartDrawer>
        <Button className={cn('group relative', className)}>
            <span className='h-full w-[1px] bg-white/30 mx-3' />
            <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <LayoutDashboard size={16} className='h-4 w-4 relative' strokeWidth={2} />
            </div>
            <ArrowRight
                size={20}
            className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" 
            />
        </Button>
    </DashboardCartDrawer>
  );
};
