'use client';
import React from 'react';
import { Title } from '@/shared/components/shared/title';
import { Button } from '@/shared/components/ui/button';
import { TFormLoginValues, formLoginSchema } from './schemas';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FormInput } from '@/shared/components/shared/form';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore, useIsAdminStore } from '@/shared/store';
import { UserRole } from '@prisma/client';
import { prisma } from '@/prisma/prisma client';
import Cookies from 'js-cookie';

interface Props {
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const setIsAdmin = useIsAdminStore((state) => state.setIsAdmin);
  const cartState = useCartStore((state) => state);
     /* React.useEffect(() => {
          cartState.fetchCartItems();
      }, [] );*/
  
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn('credentials', {
        ...data,
        redirect: false, 
      });

      if (!resp?.ok) { 
        throw Error();
      }

      // Получаем данные о пользователе после успешной авторизации
      const userResponse = await fetch('/api/auth/me'); // Предполагаемый эндпоинт для получения данных пользователя
      const userData = await userResponse.json();
      console.log(userData.email);
      Cookies.set("cartToken", userData.cart?.token)
  
      
      // Проверяем, является ли пользователь администратором
      if (userData?.role === UserRole.ADMIN) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        cartState.fetchCartItems();
      }
      console.log(userData?.role);

      toast.success('Вы успешно вошли в аккаунт', {
        icon: '✅',
      });

      onClose?.();
    } catch (error) {
      console.log('Error [LOGIN]', error);
      toast.error('Не удалось войти в аккаунт', {
        icon: '❌',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title text="Вход в аккаунт" size="md" className="font-bold" />
            <p className="text-gray-400">Введите свою почту, чтобы войти в свой аккаунт</p>
          </div>
          <img src="/assets/images/phone-icon.png" alt="phone-icon" width={60} height={60} />
        </div>

        <FormInput name="email" label="E-Mail" required />
        <FormInput type="password" name="password" label="Пароль" required />

        <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
