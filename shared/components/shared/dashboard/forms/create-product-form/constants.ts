import { z } from "zod";

export const CreateProductFormSchema = z.object({
  name: z.string().nonempty("Название продукта обязательно"),
  imageUrl: z.string().url("Введите корректный URL"),
  category: z.string().nonempty("Категория обязательна"),
  ingredients: z.array(z.string()).optional(), // Массив ID выбранных ингредиентов
});

export type CreateProductFormValues = z.infer<typeof CreateProductFormSchema>;