'use client';

import {
  deleteCategory,
  deleteIngredient,
  deleteProduct,
  deleteProductItem,
  deleteUser,
} from '@/app/actions';
import { Button } from '@/shared/components/ui/button';
import { useCategoriesUpdateStore, useIngredientsUpdateStore, useProductsUpdateStore } from '@/shared/store';
import { useProductItemsUpdateStore } from '@/shared/store/productItemsUpdate';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
  id: number;
  type: 'user' | 'category' | 'product' | 'ingredient' | 'product-items';
  className?: string;

}

export const DeleteButton: React.FC<Props> = ({ id, type, className }) => {
  const setIsCategoriesUpdate = useCategoriesUpdateStore((state) => state.setIsCategoriesUpdate);
  const setIsIngredientsUpdate = useIngredientsUpdateStore((state) => state.setIsingredientsUpdate);
  const setIsProductsUpdate = useProductsUpdateStore((state) => state.setIsProductsUpdate);
  const setIsProductitemsUpdate = useProductItemsUpdateStore((state) => state.setIsProductItemsUpdate);
  const onClickRemove = async (id: number) => {
    if (type === 'user') {
      await deleteUser(id);
    } else if (type === 'category') {
      await deleteCategory(id);
      setIsCategoriesUpdate(true)
    } else if (type === 'product') {
      await deleteProduct(id);
      setIsProductsUpdate(true)
    } else if (type === 'ingredient') {
      await deleteIngredient(id);
      setIsIngredientsUpdate(true)
    } else if (type === 'product-items') {
      await deleteProductItem(id);
      setIsProductitemsUpdate(true);

    }
  };

  return (
    <Button onClick={() => {onClickRemove(id)}} className="w-10 h-10 p-0 text-white">
      <Trash2 size={16} />
    </Button>
  );
};
