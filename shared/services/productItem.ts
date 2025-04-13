import { axiosInstance } from './instance';

export const getAllProductItems = async () => {
  const { data } = await axiosInstance.get('productItems');
  return data;
};
  
