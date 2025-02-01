import { Container, Title, TopBar, Filters } from "@/components/shared";
import { ProductCard } from "@/components/shared/product-card";
import { ProductsGroupList } from "@/components/shared/products-group-list";

export default function Home() {
  return <>
    <Container className="mt-10">
      <Title text="Все пиццы" size="lg" className="font-extrabold"/>

    </Container>
    <TopBar />
    <Container className="mt-10 pb-14">
      <div className="flex gap-[80px]">

        {/* Фильтрация */}
        <div className="w-[250px]">
          <Filters />
        </div>

        {/* Список товаров */}
        <div className="flex-1">
          <div className="flex flex-col gap-16">
            <ProductsGroupList title="Пиццы" items={[{
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            },
            {
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            },
            {
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            }
            ]} categoryId={1}>
            </ProductsGroupList>
            <ProductsGroupList title="Завтраки" items={[{
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            },
            {
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            },
            {
              id: 1,
              name: "Чизбургер пицца",
              imageUrl: "https://media.dodostatic.net/image/r:292x292/11ef9c1daafcf3529a62947b9522a8fe.avif",
              price: 550,
              items: [{price: 550},{price: 600},{price: 650}],
            }
            ]} categoryId={1}>
            </ProductsGroupList>
          </div>
        </div>

      </div>
    </Container>
  </>;
}
