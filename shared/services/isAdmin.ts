import { axiosInstance } from './instance';

export const isAdmin = async () => {
  const { data } = await axiosInstance.get('/auth/isAdmin');
  return data;
};