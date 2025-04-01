'use client'
import {Container, Title, DashboardMenu } from "@/shared/components";
import React from "react";


export default function Dashboard() {
  return (
      <Container className="mt-10">
          <Title
            text="Панель администратора"
            className="text-left font-extrabold mb-8 text-[36px] px-4 md:px-8 lg:px-12"
          />
          <div className="flex flex-col flex-1 mb-20">
            <DashboardMenu></DashboardMenu>
          </div>
      </Container>
  )
}