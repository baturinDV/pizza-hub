'use client';
import { useEffect, useState } from "react";
import { Button, Container, DeleteButton, Title } from "@/shared/components"; 
import { Api } from "@/shared/services/api-client"; 
import toast from "react-hot-toast";
import { Category, Ingredient, Product } from "@prisma/client";
import React from "react";
import { CreateIngredientForm } from "@/shared/components/shared/dashboard/forms/create-ingredient-form/create-ingredient-form";
import { useProductAdminStore, useProductsUpdateStore } from "@/shared/store";
import { ProductWithIngredients } from "@/@types/productWithIngredients";
import { CreateProductForm } from "@/shared/components/shared/dashboard/forms/create-product-form/create-product-form";

// Определение стилей, чтобы избежать повторений
const rowClasses = "py-4 px-2 border-b border-orange-500 text-center"; // Центрируем текст
const selectClasses = "border border-orange-500 rounded p-1 w-full"; // Ширина select на 100%

export default  function DashboardProductsPage() { 
    const newLocal = useState<ProductWithIngredients[]>([]);
    const [products, setProducts] = newLocal;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const setActiveProduct = useProductAdminStore((state) => state.setActiveProduct);
    const setIsProductsUpdate = useProductsUpdateStore((state) => state.setIsProductsUpdate);
    const isProductsUpdate = useProductsUpdateStore((state) => state.isProductsUpdate);
    const activeProduct = useProductAdminStore((state) => state.activeProduct);
    async function fetchProducts() {
        setLoading(true); // Устанавливаем состояние загрузки
        try {
            const responseProducts = await Api.products.getAllProducts();
            setProducts(responseProducts); 
            const responseCategories = await Api.categories.getAllCategories();
            setCategories(responseCategories); 
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            toast.error('Не удалось загрузить продукты'); 
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        setActiveProduct(null);
        fetchProducts();
        setIsProductsUpdate(false); 
    }, [isProductsUpdate]);
  return (
    <Container className="mt-10 p-4 md:p-8 lg:p-10">
        <div className="flex items-center space-x-4 mb-8">
            <Title
                text="Панель администратора для продуктов" 
                 className="text-left font-extrabold mb-0 text-2xl md:text-3xl lg:text-4xl"
            />      
            {activeProduct != null && <Button loading={loading} onClick={() => {setActiveProduct(null)}}>Создать</Button>}
        </div>

        {loading && <p className="text-center text-gray-600">Загрузка...</p>}
        { <CreateProductForm />}
        <div className="p-6 overflow-x-auto">
    <table className="min-w-full bg-white border border-orange-500 table-fixed">
        <thead>
            <tr className="bg-orange-500 text-white">
                <th className={rowClasses}>ID</th>
                <th className={rowClasses}>Наименование</th>
                <th className={rowClasses}>Категория</th>
                <th className={rowClasses}>Ссылка на изображение</th>
                <th className={rowClasses}>Ингредиенты</th>
                <th className={rowClasses}>Действия</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
                <tr key={product.id} className="hover:bg-orange-100">
                    <td className={rowClasses}>{product.id}</td>
                    <td className={rowClasses}>{product.name}</td>
                    <td className={rowClasses}>{categories.find(category => category.id == product.categoryId)?.name || ""}</td>
                    <td className={`${rowClasses} break-all`}>{product.imageUrl}</td>
                    <td className={rowClasses}>
                        {product.ingredients.length > 0 ? (
                            product.ingredients.map((ingredient) => (
                                <p key={ingredient.id}>{ingredient.name + "; "}</p>
                            ))
                        ) : (
                            "-"
                        )}
                    </td>
                    <td className={rowClasses}>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Button loading={loading} onClick={() => {setActiveProduct(product)}}>Редактировать</Button>
                            <DeleteButton id={product.id} type="ingredient" />
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