import { axiosInstance } from './instance';

export const getAllCategories = async () => {
  const { data } = await axiosInstance.get('/categories');
  return data;
};