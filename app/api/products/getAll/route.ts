import { prisma } from '@/prisma/prisma client';
import { Ingredient, Product } from '@prisma/client';
import { NextResponse } from 'next/server';

export interface ProductsWithIngredients extends Product {
  ingredients: Ingredient[]
}

export async function GET() {
  const products = await prisma.product.findMany({
    select: {  
      id: true,           
      name: true,   
      imageUrl: true,
      ingredients: true,
      categoryId:true,
  },
  });

  return NextResponse.json(products);
}
