'use client';
import React, { useEffect, useState } from 'react';
import { Container } from '@/shared/components/shared/container';
import { FormInput } from '@/shared/components/shared/form';
import { Title } from '@/shared/components/shared/title';
import { Button } from '@/shared/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReadyStatus, User, Order } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { TFormRegisterValues, formRegisterSchema } from './modals/auth-model/forms/schemas';
import { updateUserInfo } from '@/app/actions';
import { Api } from '@/shared/services/api-client';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertCircle, 
  ShoppingBag, 
  XCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

interface Props {
  data: User;
}

type OrderWithItems = Order & {
  items: any;
};

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const [activeOrders, setActiveOrders] = useState<OrderWithItems[]>([]);
  const [historyOrders, setHistoryOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      try {
        // Получаем активные заказы
        const activeStatuses = [
          ReadyStatus.NEW, 
          ReadyStatus.INPROGRES, 
          ReadyStatus.READY, 
          ReadyStatus.INDELIVERY
        ];
        const activeResponse = await Api.orders.getUserOrders(data.id, activeStatuses);
        setActiveOrders(activeResponse);

        // Получаем историю заказов
        const historyStatuses = [ReadyStatus.CANCELLED, ReadyStatus.COMPLETED];
        const historyResponse = await Api.orders.getUserOrders(data.id, historyStatuses);
        setHistoryOrders(historyResponse);
      } catch (error) {
        console.error("Ошибка при загрузке заказов", error);
        toast.error('Не удалось загрузить заказы');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, [data.id]);

  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {

    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.error('Данные обновлены 📝', {
        icon: '✅',
      });
    } catch (error) {
      return toast.error('Ошибка при обновлении данных', {
        icon: '❌',
      });
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: '/',
    });
    Cookies.remove('cartToken');
  };

  const getStatusIcon = (status: ReadyStatus) => {
    switch (status) {
      case ReadyStatus.NEW:
        return <ShoppingBag className="text-blue-500" />;
      case ReadyStatus.INPROGRES:
        return <Clock className="text-yellow-500" />;
      case ReadyStatus.READY:
        return <Package className="text-green-500" />;
      case ReadyStatus.INDELIVERY:
        return <Truck className="text-purple-500" />;
      case ReadyStatus.COMPLETED:
        return <CheckCircle className="text-green-600" />;
      case ReadyStatus.CANCELLED:
        return <XCircle className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  const getStatusText = (status: ReadyStatus) => {
    switch (status) {
      case ReadyStatus.NEW:
        return "Новый";
      case ReadyStatus.INPROGRES:
        return "В процессе";
      case ReadyStatus.READY:
        return "Готов к доставке";
      case ReadyStatus.INDELIVERY:
        return "В доставке";
      case ReadyStatus.COMPLETED:
        return "Выполнен";
      case ReadyStatus.CANCELLED:
        return "Отменен";
      default:
        return "Неизвестный статус";
    }
  };

  const getProgressPercentage = (status: ReadyStatus) => {
    switch (status) {
      case ReadyStatus.NEW:
        return 25;
      case ReadyStatus.INPROGRES:
        return 50;
      case ReadyStatus.READY:
        return 75;
      case ReadyStatus.INDELIVERY:
        return 90;
      case ReadyStatus.COMPLETED:
        return 100;
      case ReadyStatus.CANCELLED:
        return 0;
      default:
        return 0;
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container className="my-10">
      <Title text={`Личный кабинет | #${data.id}`} size="md" className="font-bold mb-10" />

      <div className="flex flex-col md:flex-row gap-10">
        {/* Левая колонка - Профиль */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Личные данные</h2>
            <FormProvider {...form}>
              <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormInput name="email" label="E-Mail" required />
                <FormInput name="fullName" label="Полное имя" required />
                <FormInput type="password" name="password" label="Новый пароль" required />
                <FormInput type="password" name="confirmPassword" label="Повторите пароль" required />

                <Button disabled={form.formState.isSubmitting} className="text-base mt-6" type="submit">
                  Сохранить
                </Button>

                <Button
                  onClick={onClickSignOut}
                  variant="secondary"
                  disabled={form.formState.isSubmitting}
                  className="text-base"
                  type="button">
                  Выйти
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* Правая колонка - Заказы */}
        <div className="w-full md:w-2/3">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Активные заказы */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6">Активные заказы</h2>
                {activeOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">У вас нет активных заказов</p>
                ) : (
                  <div className="space-y-6">
                    {activeOrders.map((order) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.resultStatus)}
                            <span className="font-medium">Заказ #{order.id}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{getStatusText(order.resultStatus)}</span>
                            <span className="text-sm">{getProgressPercentage(order.resultStatus)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div 
                              className="bg-orange-500 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${getProgressPercentage(order.resultStatus)}%` }}
                              transition={{ duration: 0.5 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <div>
                            <p><span className="font-medium">Получатель:</span> {order.fullName}</p>
                            <p><span className="font-medium">Адрес:</span> {order.address}</p>
                          </div>
                          <div className="font-bold text-lg">
                            {order.totalAmount.toLocaleString()} ₽
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* История заказов */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6">История заказов</h2>
                {historyOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">История заказов пуста</p>
                ) : (
                  <div className="space-y-4">
                    {historyOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.resultStatus)}
                            <div>
                              <p className="font-medium">Заказ #{order.id}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              order.resultStatus === ReadyStatus.COMPLETED 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {getStatusText(order.resultStatus)}
                            </span>
                            <span className="font-bold mt-1">{order.totalAmount.toLocaleString()} ₽</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
