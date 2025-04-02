import { prisma } from '@/prisma/prisma client';
import { OrderStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {  
        status: OrderStatus.SUCCEEDED,
    },
    select: {  
        id: true,           
        fullName: true,      
        resultStatus: true,  
        totalAmount: true,    
        createdAt: true,
        phone: true,
        address: true, 
        email: true,
        comment: true, 
    },
    });

    return NextResponse.json(orders);
} catch (error) {
    console.error("Error fetching orders:", error); // Логгируем ошибку
    return NextResponse.json({ error: "Не удалось получить заказы" }, { status: 500 });
}
}
