import { ReadyStatus } from '@prisma/client';
import { axiosInstance } from './instance';

export const getAllOrders = async () => {
  const { data } = await axiosInstance.get('/orders/allOrders');
  return data;
};

export const getUserOrders = async (userId : number, resultStatus : ReadyStatus[]) => {
  const params = new URLSearchParams();
  params.append('userId', userId.toString());
  
  // Добавляем каждый статус как отдельный параметр с одинаковым именем
  resultStatus.forEach(status => {
    params.append('resultStatus', status.toString());
  });

  const { data } = await axiosInstance.get('/orders/userOrdersByResultStatus', { params });
  
  return data;
};
