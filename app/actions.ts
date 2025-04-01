'use server';

import { prisma } from "@/prisma/prisma client";
import { PayOrderTemplate, VerificationUser } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { revalidatePath } from "next/cache";
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
      },
    });

    await sendEmail(createdUser.email, 'Next Pizza / 📝 Подтверждение регистрации', VerificationUser({code}));
  } catch (error) {
    console.log('Error [CREATE_USER]', error);
    throw error;
  }
}

/* Dashboard Actions */

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        verified: new Date(),
        ...(data.password && { password: hashSync(String(data.password), 10) }),
      },
    });
  } catch (error) {
    console.log('Error [UPDATE_USER]', error);
    throw error;
  }
}

export async function createUser(data: Prisma.UserCreateInput) {
  try {
    await prisma.user.create({
      data: {
        ...data,
        password: hashSync(data.password, 10),
      },
    });

    revalidatePath('/dashboard/users');
  } catch (error) {
    console.log('Error [CREATE_USER]', error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: {
      id,
    },
  });

  revalidatePath('/dashboard/users');
}

export async function updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
  try {
    await prisma.category.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.log('Error [UPDATE_CATEGORY]', error);
    throw error;
  }
}

export async function createCategory(data: Prisma.CategoryCreateInput) {
  try {
    await prisma.category.create({
      data,
    });

    revalidatePath('/dashboard/categories');
  } catch (error) {
    console.log('Error [CREATE_CATEGORY]', error);
    throw error;
  }
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({
    where: {
      id,
    },
  });

  revalidatePath('/dashboard/categories');
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  try {
    await prisma.product.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.log('Error [UPDATE_PRODUCT]', error);
    throw error;
  }
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  try {
    await prisma.product.create({
      data,
    });

    revalidatePath('/dashboard/products');
  } catch (error) {
    console.log('Error [CREATE_PRODUCT]', error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath('/dashboard/products');
}

export async function updateIngredient(id: number, data: Prisma.IngredientUpdateInput) {
  try {
    await prisma.ingredient.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.log('Error [UPDATE_INGREDIENT]', error);
    throw error;
  }
}

export async function createIngredient(data: Prisma.IngredientCreateInput) {
  try {
    await prisma.ingredient.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        price: data.price,
      },
    });

    revalidatePath('/dashboard/ingredients');
  } catch (error) {
    console.log('Error [CREATE_INGREDIENT]', error);
    throw error;
  }
}

export async function deleteIngredient(id: number) {
  try {
    await prisma.ingredient.delete({
      where: {
        id,
      },
    });

    revalidatePath('/dashboard/ingredients');
  } catch (error) {
    console.log('Error [DELETE_INGREDIENT]', error);
    throw error;
  }
}

export async function updateProductItem(id: number, data: Prisma.ProductItemUpdateInput) {
  try {
    await prisma.productItem.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.log('Error [UPDATE_PRODUCT_ITEM]', error);
    throw error;
  }
}

export async function createProductItem(data: Prisma.ProductItemUncheckedCreateInput) {
  try {
    await prisma.productItem.create({
      data: {
        price: data.price,
        size: data.size,
        pizzaType: data.pizzaType,
        productId: data.productId,
      },
    });

    revalidatePath('/dashboard/product-items');
  } catch (error) {
    console.log('Error [CREATE_PRODUCT_ITEM]', error);
    throw error;
  }
}

export async function deleteProductItem(id: number) {
  try {
    await prisma.productItem.delete({
      where: {
        id,
      },
    });

    revalidatePath('/dashboard/product-items');
  } catch (error) {
    console.log('Error [DELETE_PRODUCT_ITEM]', error);
    throw error;
  }
}

