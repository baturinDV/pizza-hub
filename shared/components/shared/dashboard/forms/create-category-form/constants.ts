import { z } from 'zod';

export const CreateCategoryFormSchema = z.object({
  name: z.string().nonempty("Имя категории не может быть пустым"),
});

export type CreateCategoryFormValues = z.infer<typeof CreateCategoryFormSchema>;
