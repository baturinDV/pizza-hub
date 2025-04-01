'use client'
import { prisma } from "@/prisma/prisma client";
import {Container, Title, DashboardMenu, DashboardFormHeader, Categories } from "@/shared/components";
import { CreateCategoryForm } from "@/shared/components/shared/dashboard/forms/create-category-form/create-category-form";
import { cn } from "@/shared/lib/utils";
import { Api } from "@/shared/services/api-client";

import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";


export default  function DashboardCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    
    React.useEffect(() => {
        async function fetchCategories() {
          const response = await Api.categories.getAllCategories();
          setCategories(response);
        }
        fetchCategories()
      }, [])

  return (
    <Container className="mt-10">
        <Title
            text="Панель администратора для категорий"
            className="text-left font-extrabold mb-8 text-[36px] px-4 md:px-8 lg:px-12"
        />

    


    </Container>
);
}