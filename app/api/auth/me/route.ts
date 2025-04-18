import { prisma } from '@/prisma/prisma client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: any, res: any) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ message: '[USER_GET] Unauthorized' }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        cart: true,
        fullName: true,
        email: true,
        password: false,
        role: true,
        
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '[USER_GET] Server error' }, { status: 500 });
  }
}
