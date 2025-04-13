import { prisma } from '@/prisma/prisma client';
import { NextResponse } from 'next/server';

export async function GET() {
  const productItems = await prisma.productItem.findMany({
  });

  return NextResponse.json(productItems);
}
