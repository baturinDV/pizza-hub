'use server';

import { prisma } from "@/prisma/prisma client";
import { CheckoutFormValues } from "@/shared/constants";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
    try {
        const cookieStore = cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found');
        }
        
        /* находим корзину по токену */ 
        const userCart = await prisma.cart.findFirst({
            include: {
              user: true,
              items: {
                include: {
                  ingredients: true,
                  productItem: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
            where: {
                token: cartToken,
            },
        });
      
        /* Если корзина не найдена возвращаем ошибку*/
        if (!userCart) {
            throw new Error('Cart not found');
        }

        /* Если корзина пустая возвращаем ошибку */
        if (userCart?.totalAmount === 0) {
        throw new Error('Cart is empty')
        }

        /* Создаем заказ */
        const order = await prisma.order.create({
            data: {
              token: cartToken,  
              fullName: data.firstName + ' ' + data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              comment: data.comment,
              totalAmount: userCart.totalAmount,
              status: OrderStatus.PENDING,
              items: JSON.stringify(userCart.items),
            },
        });

        /* Очищаем корзину */
        await prisma.cart.update({
            where: {
              id: userCart.id,
            },
            data: {
              totalAmount: 0,
            },
        });

        await prisma.cartItem.deleteMany({
            where: {
              cartId: userCart.id,
            },
          });

          
        return "https://github.com/baturinDV/pizza-hub/commits/master/"; 
    } catch (error) {
        console.log('[CART_CHECKOUT_POST] Server error', error);
        throw error;
    }
}
  /*  try {
      const currentUser = await getUserSession();
      const userId = Number(currentUser?.id);
      const cookieStore = cookies();
      const cartToken = cookieStore.get('cartToken')?.value;
  
      
  
  

  

  
      const paymentData = await createPayment({
        orderId: order.id,
        amount: order.totalAmount,
        description: `Заказ #${order.id}`,
      });
  
      if (paymentData) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentId: paymentData.id,
          },
        });
      }
  
      const html = `
        <h1>Заказ #${order?.id}</h1>
  
        <p>Оплатите заказ на сумму ${order?.totalAmount}. Перейдите <a href="${paymentData.confirmation.confirmation_url}">по ссылке</a> для оплаты заказа.</p>
      `;
  
      if (userCart.user?.email) {
        await sendEmail(userCart.user?.email, `Next Pizza / Оплатите заказ #${order?.id}`, html);
      }
  
      return paymentData.confirmation.confirmation_url;
    } catch (error) {
      console.log('[CART_CHECKOUT_POST] Server error', error);
      throw error;
    }
  }*/