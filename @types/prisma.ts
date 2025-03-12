import { ingredients } from '@/prisma/constants';
import type { Ingredient, Product, ProductItem } from '@prisma/client';

export type ProductWithReletions = Product & { items: ProductItem[]; ingredients: Ingredient[] };