'use client';
import { ProductWithReletions } from "@/@types/prisma";
import { useCartStore } from "@/shared/store";
import toast from "react-hot-toast";
import { ChoosePizzaForm, ChooseProductForm } from ".";

interface Props {
    product: ProductWithReletions;
    onSubmit?: VoidFunction;
    className?: string;
  }
  
  export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit}) => {
    const addCartItem = useCartStore((state) => state.addCartItem);
    const loading = useCartStore((state) => state.loading);

    const firstItem = product.items[0];
    const isPizzaForm = Boolean(firstItem.pizzaType);

    const onSubmit = async (productItemId?: number, ingredients?: number[]) =>{
        try {
            const itemId = productItemId ?? firstItem.id;
            await addCartItem({
                productItemId: itemId,
                ingredients,
            })
    
            toast.success(product.name + ' добавлена в корзину');

            _onSubmit?.();
        } catch(err){
            toast.error('Не удалось добавить пиццу в корзину');
            console.error(err);
        }
    }

      
    if (isPizzaForm) {
        return (
            <ChoosePizzaForm
                imageUrl={product.imageUrl}
                name={product.name}
                items={product.items}
                ingredients={product.ingredients}
                onSubmit={onSubmit}
                loading={loading}
            />
        )
    } 
       
    return (
        <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.name}
            onSubmit={onSubmit}
            price={firstItem.price}
            loading={loading}
        />
    )

  };