'use client';
import { useEffect, useState } from "react";
import { Button, Container, DeleteButton, Title } from "@/shared/components"; 
import { Api } from "@/shared/services/api-client"; 
import toast from "react-hot-toast";
import { Ingredient } from "@prisma/client";
import React from "react";
import { useIngredientAdminStore, useIngredientsUpdateStore } from "@/shared/store";
import { CreateIngredientForm } from "@/shared/components/shared/dashboard/forms/create-ingredient-form/create-ingredient-form";


// Определение стилей, чтобы избежать повторений
const rowClasses = "py-4 px-2 border-b border-orange-500 text-center"; // Центрируем текст
const selectClasses = "border border-orange-500 rounded p-1 w-full"; // Ширина select на 100%

export default  function DashboardIngredientsPage() { 
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);
    const setActiveIngredient = useIngredientAdminStore((state) => state.setActiveIngredient);
    const setIsIngredientsUpdate = useIngredientsUpdateStore((state) => state.setIsingredientsUpdate);
    const isIngredientsUpdate = useIngredientsUpdateStore((state) => state.isIngredientsUpdate);
    const activeIngredient = useIngredientAdminStore((state) => state.activeIngredient);
    async function fetchCategories() {
        setLoading(true); // Устанавливаем состояние загрузки
        try {
            const response = await Api.ingredients.getAll();
            setIngredients(response); 
        } catch (error) {
            console.error('Ошибка при загрузке ингредиентов:', error);
            toast.error('Не удалось загрузить ингредиенты'); 
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        setActiveIngredient(null);
        fetchCategories();
        setIsIngredientsUpdate(false); 
    }, [isIngredientsUpdate]);


  return (
    <Container className="mt-10 p-4 md:p-8 lg:p-10">
        <div className="flex items-center space-x-4 mb-8">
            <Title
                text="Панель администратора для категорий" 
                 className="text-left font-extrabold mb-0 text-2xl md:text-3xl lg:text-4xl"
            />      
            {activeIngredient != null && <Button loading={loading} onClick={() => {setActiveIngredient(null)}}>Создать</Button>}
        </div>

        {loading && <p className="text-center text-gray-600">Загрузка...</p>}

        { <CreateIngredientForm />}
        <div className="p-6 overflow-auto">
                    <table className="min-w-full bg-white border border-orange-500">
                        <thead>
                            <tr className="bg-orange-500 text-white">
                                <th className={rowClasses}>ID</th>
                                <th className={rowClasses}>Наименование</th>
                                <th className={rowClasses}>Цена</th>
                                <th className={rowClasses}>Ссылка на изображение</th>
                                <th className={rowClasses}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ingredient) => (
                                <tr key={ingredient.id} className="hover:bg-orange-100">
                                    <td className={rowClasses}>{ingredient.id}</td>
                                    <td className={rowClasses}>{ingredient.name}</td>
                                    <td className={rowClasses}>{ingredient.price}</td>
                                    <td className={rowClasses}>{ingredient.imageUrl}</td>
                                    <td className={rowClasses}>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Button loading={loading} onClick={() => {setActiveIngredient(ingredient)}} 
                                            className={activeIngredient?.id === ingredient.id ? "bg-gray-500 text-white" : "bg-orange-600 text-white"}>Редактировать</Button>
                                            <DeleteButton id={ingredient.id} type="ingredient" />
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