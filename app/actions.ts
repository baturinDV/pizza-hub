'use server';

import { prisma } from "@/prisma/prisma client";
import { PayOrderTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
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
  
        const paymentData = await createPayment({
          amount: order.totalAmount,
          orderId: order.id,
          description: 'Оплата заказа #' + order.id,
        });

        if(!paymentData) {
          throw new Error('Payment data not found');
        }

        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentId: paymentData.id,
          },
        });

        const paymentUrl = paymentData.confirmation.confirmation_url;

       await sendEmail(data.email, `Next Pizza / Оплатите заказ #` + order.id, PayOrderTemplate({
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentUrl: paymentUrl,
       }));


        return paymentUrl; 
    } catch (error) {
        console.log('[CreateOrder] Server error', error);
    }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {

    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      }
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });
  } catch (error) {
    console.log('Error [UPDATE_USER]', error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error('Почта не подтверждена');
      }

      throw new Error('Пользователь уже существует');
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log(createdUser);

    const html = `
    <p>Код подтверждения: <h2>${code}</h2></p>
    <p><a href="http://localhost:3000/api/auth/verify?code=${code}">Подтвердить регистрацию</a></p>
    `;

    await sendEmail(createdUser.email, 'Next Pizza / Подтверждение регистрации', html);
  } catch (error) {
    console.log('Error [CREATE_USER]', error);
    throw error;
  }
}
