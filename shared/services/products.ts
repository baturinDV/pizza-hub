import { Product } from "@prisma/client";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const search = async (query: string): Promise<Product[]>=> {
    return (await axiosInstance.get<Product[]>(ApiRoutes.SEARCH_PRODUCTS, { params: { query } })).data;
  };

  export const getAllProducts = async () => {
    const { data } = await axiosInstance.get('products/getAll');
    return data;
  };
  