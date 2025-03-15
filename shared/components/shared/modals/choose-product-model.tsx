'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ProductWithReletions } from '@/@types/prisma';
import { cn } from '@/shared/lib/utils';

import { ProductForm } from '..';

interface Props {
  product: ProductWithReletions;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() =>  router.back()}>
      <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden", className,)}>
      <ProductForm product={product} onSubmit={() => router.back()}></ProductForm>
      </DialogContent>
    </Dialog>
  );
};
