'use client'
import { CheckoutSidebar, Container, Title} from "@/shared/components/shared";
import { useCart } from "@/shared/hooks";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutAddressForm, CheckoutCart, CheckoutPersonalForm } from "@/shared/components/shared/checkout";
import { CheckoutFormValues, checkoutFormSchema } from "@/shared/components/shared/checkout/checkout-form-schema";


export default function CheckoutPage() {
  const {totalAmount, updateItemQuantity,items, removeCartItem} = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    console.log(data);
  };

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
      <Container className="mt-10">
          <Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex gap-10">
                {/* Левая часть */}
                <div className="flex flex-col gap-10 flex-1 mb-20">

                  <CheckoutCart
                    onClickCountButton={onClickCountButton}
                    removeCartItem={removeCartItem}
                    items={items}>
                  </CheckoutCart>

                    <CheckoutPersonalForm></CheckoutPersonalForm>

                    <CheckoutAddressForm></CheckoutAddressForm>
                </div>


                {/* Правая часть */}
                <div className="w-[450px]">
                    <CheckoutSidebar
                    totalAmount={totalAmount}>
                    </CheckoutSidebar>
                </div>
              </div>
            </form>
          </FormProvider>
      </Container>
  )
}

/*
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-10">
          <div className="flex flex-col gap-10 flex-1 mb-20">
            <WhiteBlock
              title="1. Корзина"
              endAdornment={
                totalAmount > 0 && (
                  <button className="flex items-center gap-3 text-gray-400 hover:text-gray-600">
                    <Trash2 size={16} />
                    Очистить корзину
                  </button>
                )
              }>
              <div className="flex flex-col gap-5">
                {loading
                  ? [...Array(3)].map((_, index) => <CartItemSkeleton key={index} />)
                  : items.map((item) => (
                      <CartItem
                        key={item.id}
                        name={item.name}
                        imageUrl={item.imageUrl}
                        price={item.price}
                        quantity={item.quantity}
                        onClickRemove={() => removeCartItem(item.id)}
                        onClickCountButton={(type) =>
                          onClickCountButton(item.id, item.quantity, type)
                        }
                      />
                    ))}
              </div>

              {!totalAmount && <p className="text-center text-gray-400 p-10">Корзина пустая</p>}
            </WhiteBlock>

            <WhiteBlock
              title="2. Персональная информация"
              className={!totalAmount ? 'opacity-50 pointer-events-none' : ''}
              contentClassName="p-8">
              <div className="grid grid-cols-2 gap-5">
                <FormInput name="firstName" className="text-base" placeholder="Имя" />
                <FormInput name="lastName" className="text-base" placeholder="Фамилия" />
                <FormInput name="email" className="text-base" placeholder="E-Mail" />
                <FormInput name="phone" className="text-base" placeholder="Телефон" />
              </div>
            </WhiteBlock>

            <WhiteBlock
              className={!totalAmount ? 'opacity-50 pointer-events-none' : ''}
              title="3. Адрес доставки"
              contentClassName="p-8">
              <div className="flex flex-col gap-5">
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field }) => <AdressInput onChange={field.onChange} />}
                />

                <FormTextarea
                  name="comment"
                  className="text-base"
                  placeholder="Комментарий к заказу"
                  rows={5}
                />
              </div>
            </WhiteBlock>
          </div>
          <div className="w-[450px]">
            <CartSidebar
              totalPrice={totalPrice}
              totalAmount={totalAmount}
              vatPrice={vatPrice}
              deliveryPrice={DELIVERY_PRICE}
              submitting={submitting}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  </Container>
    )
}*/