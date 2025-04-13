"use client";
import { prisma } from "@/prisma/prisma client";
import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormIngredientsSelect, FormInput, FormSelect } from "@/shared/components/shared/form";
import {
  createProduct,
  updateProduct,
} from "@/app/actions";
import toast from "react-hot-toast";
import { DashboardFormHeader } from "../../dashboard-form-header";
import {
  CreateProductFormSchema,
  CreateProductFormValues,
} from "@/shared/components/shared/dashboard/forms/create-product-form/constants";
import { Category, Ingredient, Prisma } from "@prisma/client";
import { useProductAdminStore, useProductsUpdateStore } from "@/shared/store";
import { ProductWithIngredients } from "@/@types/productWithIngredients";

interface Props {
  values?: ProductWithIngredients;
  categories: Category[];
  ingredients: Ingredient[];
}

export const CreateProductForm: React.FC<Props> = ({ values, categories, ingredients }) => {
  const activeProduct = useProductAdminStore((state) => state.activeProduct);
    const params = activeProduct?.id || null;
    const setIsProductsUpdate = useProductsUpdateStore((state) => state.setIsProductsUpdate);
    const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateProductFormValues>({ 
    defaultValues: {
      name: values?.name || "",
      imageUrl: values?.imageUrl || "",
      category: values?.categoryId.toString() || "",
    },
    resolver: zodResolver(CreateProductFormSchema),
  });

 React.useEffect(() => {

      if (activeProduct) {       
          form.reset({
          name: activeProduct.name,
          imageUrl: activeProduct.imageUrl,
          category: activeProduct.categoryId.toString(),
          ingredients:
        activeProduct.ingredients?.map((ingredient) => ingredient.id.toString()) 
        });
      }
      else {
        form.reset({
          name: "",
          imageUrl: "",
          category: "",
          ingredients: [],
        });
      }
    }, [activeProduct, form]);

  const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
    try {
      setLoading(true);

      const fields: Prisma.ProductUncheckedCreateInput = {
        name: data.name,
        imageUrl: data.imageUrl,
        categoryId: Number(data.category),
        ingredients: {
          // Связываем ингредиенты через их ID
          connect: data.ingredients?.map((id) => ({ id: Number(id) })) || [],
        },
      };

      if (params != null) {
        await updateProduct(params, fields);
      } else {
        await createProduct(fields);
      }
    } catch (error) {
      console.log("Error [CREATE_PRODUCT]", error);
      toast.error("Произошла ошибка");
    } finally {
      setLoading(false);
      setIsProductsUpdate(true);
      form.reset({
        name: "",
        imageUrl: "",
        category: "",

      });
    }
  };


  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={activeProduct != null} loading={loading} />
        <div className="flex items-center border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <div>
            <FormInput name="name" label="Название продукта" required />
            <FormInput name="imageUrl" label="Ссылка на изображение" required />
            <FormSelect
                      name="category"
                      label="Кактегория"
                      placeholder="Выберите категорию..."
                      items={categories.map((category) => ({
                        value: category.id.toString(),
                        label: category.name,
                      }))}
                      required
              />
          </div>
          <div>
        {/* Компонент для выбора ингредиентов */}
        <FormIngredientsSelect
          name="ingredients"
          items={ingredients.map((ingredient) => ({
            id: ingredient.id.toString(),
            name: ingredient.name,
          }))}
        />
      </div>
        </div>
      </form>
    </FormProvider>
  );
};

