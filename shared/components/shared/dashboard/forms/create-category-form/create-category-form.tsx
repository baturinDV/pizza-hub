'use client';
import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/shared/components/shared/form/form-input';
import { CreateCategoryFormSchema, CreateCategoryFormValues } from './constants';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createCategory, updateCategory } from '@/app/actions';
import { DashboardFormHeader } from '../../dashboard-form-header';
import { useCategoryAdminStore } from '@/shared/store';
import { Button } from '@/shared/components';

export const CreateCategoryForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const activeCategory = useCategoryAdminStore((state) => state.activeCategory);
  const params = activeCategory?.id || null;
  
  const form = useForm<CreateCategoryFormValues>({
    defaultValues: {
      name: activeCategory?.name,
    },

    resolver: zodResolver(CreateCategoryFormSchema),
  });

  // useEffect для обновления значений формы при изменении activeCategory
  React.useEffect(() => {
    if (activeCategory) {
      form.reset({
        name: activeCategory.name,
      });
    }
    else {
      form.reset({
        name: "",
      });
    }
  }, [activeCategory, form]);

  const onSubmit: SubmitHandler<CreateCategoryFormValues> = async (data) => {
    try {
      setLoading(true);

      if (params != null) {
        await updateCategory(params, data);
      } else {
        await createCategory(data);
        router.push('/dashboard/categories');
      }

      console.log(data);
    } catch (error) {
      console.log('Error [CREATE_CATEGORY]', error);
      toast.error('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={activeCategory != null} loading={loading} />
        <div className="border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <FormInput name="name" label="Название категории" required />
        </div>
      </form>
    </FormProvider>
  );
};
