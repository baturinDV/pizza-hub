'use client';
import { useEffect, useState } from "react";
import { Button, Container, DashboardFormHeader, DeleteButton, Title } from "@/shared/components"; 
import { Api } from "@/shared/services/api-client"; 
import { CreateCategoryForm } from "@/shared/components/shared/dashboard/forms/create-category-form/create-category-form";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";
import { useCategoryAdminStore } from "@/shared/store";
import router from "next/router";


export default function DashboardCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const setActiveCategory = useCategoryAdminStore((state) => state.setActiveCategory);
    const activeCategory = useCategoryAdminStore((state) => state.activeCategory);
    useEffect(() => {
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
      setActiveCategory(null);
      fetchCategories();
  }, []);


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

        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Список категорий</h2> 
            <ul className="space-y-4">
                {categories.map(category => (
                    <li 
                        onClick={() => {
                            setActiveCategory(category);
                        }}  
                        key={category.id} 
                        className="flex justify-between items-center border-b py-4 px-2 hover:bg-gray-50 rounded-lg transition duration-200"
                    >
                        <span className="text-lg font-medium">{category.name}</span>
                        <div className="flex items-center space-x-2">
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
                    </li>
                ))}
            </ul>
        </div>
    </Container>
);
}