import { prisma } from '@/prisma/prisma client';
import { NextResponse } from 'next/server';

export async function GET() {
  const categoryes = await prisma.category.findMany({
  });

  return NextResponse.json(categoryes);
}
