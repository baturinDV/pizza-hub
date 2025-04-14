import { prisma } from '@/prisma/prisma client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { OrderStatus, ReadyStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Получаем параметры из запроса
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get('userId') || '0');
  const statusArray = searchParams.getAll('resultStatus') as ReadyStatus[];

  if (!userId) {
    return NextResponse.json({ error: 'Требуется userId' }, { status: 400 });
  }
  
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
        resultStatus: {
          in: statusArray
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json({ error: 'Ошибка при получении заказов' }, { status: 500 });
  }
}
