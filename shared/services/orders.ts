import { Order } from '@prisma/client';
import { axiosInstance } from './instance';

export const getAllOrders = async () => {
  const { data } = await axiosInstance.get('/orders');
  return data;
};