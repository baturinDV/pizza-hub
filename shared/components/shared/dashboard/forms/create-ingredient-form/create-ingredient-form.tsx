"use client";

import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/shared/components/shared/form/form-input";
import toast from "react-hot-toast";
import { DashboardFormHeader } from "../../dashboard-form-header";
import { Ingredient} from "@prisma/client";
import {
  CreateIngredientFormSchema,
  CreateIngredientFormValues,
} from "@/shared/components/shared/dashboard/forms/create-ingredient-form/constants";
import { useIngredientAdminStore, useIngredientsUpdateStore } from "@/shared/store";
import { createIngredient2, updateIngredient } from "@/app/actions";

interface Props {
  values?: Ingredient;
}

export const CreateIngredientForm: React.FC<Props> = ({ values }) => {
  const activeIngredient = useIngredientAdminStore((state) => state.activeIngredient);
  const params = activeIngredient?.id || null;
  const setIsIngredientsUpdate = useIngredientsUpdateStore((state) => state.setIsingredientsUpdate);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateIngredientFormValues>({
    defaultValues: {
      name: values?.name || "",
      imageUrl: values?.imageUrl || "",
      //price: values?.price ? values?.price : 0,
    },
    resolver: zodResolver(CreateIngredientFormSchema),
  });

  React.useEffect(() => {
      if (activeIngredient) {
        form.reset({
          name: activeIngredient.name,
          imageUrl: activeIngredient.imageUrl,
          price:activeIngredient.price,
        });
      }
      else {
        form.reset({
          name: "",
          imageUrl: "",
          //price: 0,
        });
      }
    }, [activeIngredient, form]);

  const onSubmit: SubmitHandler<CreateIngredientFormValues> = async (data) => {
    try {
      setLoading(true);

      if (params != null) {
        await updateIngredient(params, data);
      } else {
        await createIngredient2(data);
      }

      console.log(data);
    } catch (error) {
      console.log("Error [CREATE_INGREDIENT]", error);
      toast.error("Произошла ошибка");
    } finally {
      setLoading(false);
      setIsIngredientsUpdate(true);
      form.reset({
        name: "",
        imageUrl: "",
        //price: 0,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={activeIngredient != null} loading={loading} />
        <div className="flex items-center border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <div>
            <FormInput name="name" label="Название" required />
            <FormInput name="price" label="Цена" required />
            <FormInput name="imageUrl" label="Ссылка на изображение" required />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

