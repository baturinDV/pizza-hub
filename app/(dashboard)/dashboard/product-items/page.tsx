'use client';
import { useEffect, useState } from "react";
import { Button, Container, DeleteButton, Title } from "@/shared/components"; 
import { Api } from "@/shared/services/api-client"; 
import toast from "react-hot-toast";
import { Product, ProductItem } from "@prisma/client";
import React from "react";
import { useProductItemAdminStore } from "@/shared/store/productItemAdmin";
import { useProductItemsUpdateStore } from "@/shared/store/productItemsUpdate";
import { CreateProductItemForm } from "@/shared/components/shared/dashboard/forms/create-product-item-form/create-product-item-form";
import { mapPizzaType } from "@/shared/constants";

// Определение стилей, чтобы избежать повторений
const rowClasses = "py-4 px-2 border-b border-orange-500 text-center"; // Центрируем текст
const selectClasses = "border border-orange-500 rounded p-1 w-full"; // Ширина select на 100%

export default  function DashboardProductItemsPage() { 
    const newLocal = useState<ProductItem[]>([]);
    const [productItems, setProductItems] = newLocal;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const setActiveProductItem = useProductItemAdminStore((state) => state.setActiveProductItem);
    const activeProductItem = useProductItemAdminStore((state) => state.activeProductItem);
    const setIsProductItemsUpdate = useProductItemsUpdateStore((state) => state.setIsProductItemsUpdate);
    const isProductItemsUpdate = useProductItemsUpdateStore((state) => state.isProductItemsUpdate);
    async function fetchProductItems() {
        setLoading(true); // Устанавливаем состояние загрузки
        try {
            const responseProducts = await Api.products.getAllProducts();
            setProducts(responseProducts); 
            const responseProductItems = await Api.productItem.getAllProductItems();
            setProductItems(responseProductItems); 
        } catch (error) {
            console.error('Ошибка при загрузке вариаций продуктов:', error);
            toast.error('Не удалось загрузить вариации продуктов'); 
        } finally {
            setLoading(false); 
        } 
    }

    useEffect(() => {
        setActiveProductItem(null);
        fetchProductItems();
        setIsProductItemsUpdate(false); 
    }, [isProductItemsUpdate]);


    useEffect(() => {
        if (activeProductItem) {
          // Прокручиваем с небольшой задержкой для гарантии обновления DOM
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth" // Плавная прокрутка
            });
          }, 200);
        }
      }, [activeProductItem]); 
  return (
    <Container className="mt-10 p-4 md:p-8 lg:p-10">
        <div className="flex items-center space-x-4 mb-8">
            <Title
                text="Панель администратора для вариаций продуктов" 
                 className="text-left font-extrabold mb-0 text-2xl md:text-3xl lg:text-4xl"
            />      
            {activeProductItem != null && <Button loading={loading} onClick={() => {setActiveProductItem(null)}}>Создать</Button>}
        </div>

        {loading && <p className="text-center text-gray-600">Загрузка...</p>}
        { <CreateProductItemForm products={products}/>}
        <div className="p-6 overflow-x-auto">
    <table className="min-w-full bg-white border border-orange-500 table-fixed">
        <thead>
            <tr className="bg-orange-500 text-white">
                <th className={rowClasses}>ID</th>
                <th className={rowClasses}>Продукт</th>
                <th className={rowClasses}>Цена</th>
                <th className={rowClasses}>Размер</th>
                <th className={rowClasses}>Тип</th>
                <th className={rowClasses}>Действия</th>
            </tr>
        </thead>
        <tbody>
            {productItems.map((productItem) => (
                <tr key={productItem.id} className="hover:bg-orange-100">
                    <td className={rowClasses}>{productItem.id}</td>
                    <td className={rowClasses}>{products.find(product => product.id == productItem.productId)?.name || "-"}</td>
                    <td className={rowClasses}>{productItem.price}</td>
                    <td className={rowClasses}>{productItem?.size || "-"}</td>
                    <td className={rowClasses}> {productItem?.pizzaType === 1 || productItem?.pizzaType === 2 
                        ? mapPizzaType[productItem.pizzaType] 
                        : "-"}</td>
                    <td className={rowClasses}>
                        <div className="flex flex-wrap justify-center gap-2">
                             <Button loading={loading} onClick={() => {setActiveProductItem(productItem)}} 
                                className={activeProductItem?.id === productItem.id ? "bg-gray-500 text-white" : "bg-orange-600 text-white"}>Редактировать</Button>
                            <DeleteButton id={productItem.id} type="product-items" />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
    </Container>
);
}