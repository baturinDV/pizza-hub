'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormInput } from '@/shared/components/shared/form/form-input';
import type { Product, ProductItem } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProductItem, updateProductItem } from '@/app/actions';
import { DashboardFormHeader } from '../../dashboard-form-header';
import { CreateProductItemFormSchema, CreateProductItemFormValues } from './constants';
import { FormSelect } from '@/shared/components/shared/form/form-select';
import { useProductItemsUpdateStore } from '@/shared/store/productItemsUpdate';
import { useProductItemAdminStore } from '@/shared/store/productItemAdmin';

interface Props {
  values?: ProductItem;
  products: Product[];
}

export const CreateProductItemForm: React.FC<Props> = ({ values, products }) => {
  const setIsProductItemsUpdate = useProductItemsUpdateStore((state) => state.setIsProductItemsUpdate);
  const activeProductItem = useProductItemAdminStore((state) => state.activeProductItem);
  const [loading, setLoading] = React.useState(false);
  const params = activeProductItem?.id || null;

  const form = useForm<CreateProductItemFormValues>({
    defaultValues: {
      price: values?.price ? String(values?.price) : '',
      size: values?.size ? String(values?.size) : '',
      pizzaType: values?.pizzaType ? String(values?.pizzaType) : '',
      productId: values?.productId ? String(values?.productId) : '',
    },
    resolver: zodResolver(CreateProductItemFormSchema),
  });

  React.useEffect(() => {

    if (activeProductItem) {       
        form.reset({
        price: activeProductItem?.price ? String(activeProductItem?.price) : '',
        size: activeProductItem?.size ? String(activeProductItem?.size) : '',
        pizzaType: activeProductItem?.pizzaType ? String(activeProductItem?.pizzaType) : '',
        productId: activeProductItem?.productId ? String(activeProductItem?.productId) : '',
      });
    }
    else {
     form.reset({
        price: '',
        size: '',
        pizzaType: '',
        productId: '',
      });
    }
  }, [activeProductItem, form]);

  const onSubmit: SubmitHandler<CreateProductItemFormValues> = async (data) => {
    try {
      setLoading(true);

      const fields = {
        price: Number(data.price),
        size: Number(data.size),
        pizzaType: Number(data.pizzaType),
        productId: Number(data.productId),
      };

      if (params) {
        await updateProductItem(params, fields);
      } else {
        await createProductItem(fields);
      }

      console.log(data);
    } catch (error) {
      console.log('Error [CREATE_PRODUCT_ITEM]', error);
      toast.error('Произошла ошибка');
    } finally {
      setLoading(false);
      setIsProductItemsUpdate(true);
      form.reset({
        price: '',
        size: '',
        pizzaType: '',
        productId: '',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={activeProductItem != null} loading={loading} />
        <div className="border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <FormInput name="price" label="Цена" required />
          <FormSelect
            name="size"
            label="Размер"
            placeholder="Выберите размер..."
            items={[
              {
                value: '20',
                label: '20',
              },
              {
                value: '30',
                label: '30',
              },
              {
                value: '40',
                label: '40',
              },
            ]}
          />
          <FormSelect
            name="pizzaType"
            label="Тип пиццы"
            placeholder="Выберите тип пиццы..."
            items={[
              {
                value: '1',
                label: 'Традиционное',
              },
              {
                value: '2',
                label: 'Тонкое',
              },
            ]}
          />
          <FormSelect
            name="productId"
            label="Продукт"
            placeholder="Выберите продукт..."
            items={products.map((product) => ({
              value: product.id.toString(),
              label: product.name,
            }))}
          />
        </div>
      </form>
    </FormProvider>
  );
};
