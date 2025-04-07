import { z } from "zod";

export const CreateIngredientFormSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  price: z.string().transform((val) => {
    const num = parseInt(val);
    return num;
  }),
});

export type CreateIngredientFormValues = z.infer<
  typeof CreateIngredientFormSchema
>;
