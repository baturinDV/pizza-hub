'use client';
import { useEffect, useState } from "react";
import { Button, Container, DashboardFormHeader, DeleteButton, Title } from "@/shared/components"; 
import { Api } from "@/shared/services/api-client"; 
import { CreateCategoryForm } from "@/shared/components/shared/dashboard/forms/create-category-form/create-category-form";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";
import { useCategoryAdminStore, useCategoriesUpdateStore } from "@/shared/store";

// Определение стилей, чтобы избежать повторений
const rowClasses = "py-4 px-2 border-b border-orange-500 text-center"; // Центрируем текст
const selectClasses = "border border-orange-500 rounded p-1 w-full"; // Ширина select на 100%

export default  function DashboardCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const setActiveCategory = useCategoryAdminStore((state) => state.setActiveCategory);
    const setIsCategoriesUpdate = useCategoriesUpdateStore((state) => state.setIsCategoriesUpdate);
    const isCategoriesUpdate = useCategoriesUpdateStore((state) => state.isCategoriesUpdate);
    const activeCategory = useCategoryAdminStore((state) => state.activeCategory);
    async function fetchCategories() {
        setLoading(true); // Устанавливаем состояние загрузки
        try {
            const response = await Api.categories.getAllCategories();
            setCategories(response); // Предполагается, что response - это массив категорий
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
            toast.error('Не удалось загрузить категории'); // Уведомление об ошибке
        } finally {
            setLoading(false); // Отключаем состояние загрузки
        }
    }

    useEffect(() => {
        setActiveCategory(null);
        fetchCategories();
        setIsCategoriesUpdate(false); 
    }, [isCategoriesUpdate]);
 
  return (
    <Container className="mt-10 p-4 md:p-8 lg:p-10">
        <div className="flex items-center space-x-4 mb-8">
            <Title
                text="Панель администратора для категорий" 
                 className="text-left font-extrabold mb-0 text-2xl md:text-3xl lg:text-4xl"
            />      
            {activeCategory != null && <Button loading={loading} onClick={() => {setActiveCategory(null)}}>Создать</Button>}
        </div>

        {loading && <p className="text-center text-gray-600">Загрузка...</p>}

        { <CreateCategoryForm />}

        <div className="p-6 overflow-auto">
                    <table className="min-w-full bg-white border border-orange-500">
                        <thead>
                            <tr className="bg-orange-500 text-white">
                                <th className={rowClasses}>ID</th>
                                <th className={rowClasses}>Наименование</th>
                                <th className={rowClasses}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-orange-100">
                                    <td className={rowClasses}>{category.id}</td>
                                    <td className={rowClasses}>{category.name}</td>
                                    <td className={rowClasses}>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Button 
                                                loading={loading} 
                                                onClick={() => {setActiveCategory(category)}} 
                                                className={activeCategory?.id === category.id ? "bg-gray-500 text-white" : "bg-orange-600 text-white"}
                                            >
                                            Редактировать
                                            </Button>
                                            <DeleteButton 
                                                id={category.id} 
                                                type="category" 
                                                className="ml-2" 
                                            />
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