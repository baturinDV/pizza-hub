'use client'
import {Container, OrderTable, Title } from "@/shared/components";
import React from "react";


export default  function DashboardOrdersPage() {
    return (
        <Container className="mt-10">
            <Title
                text="Список заказов"
                className="text-left font-extrabold mb-8 text-[36px] px-4 md:px-8 lg:px-12"
            />
            <OrderTable />
        </Container>
    );
}