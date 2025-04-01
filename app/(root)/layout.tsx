import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/shared/components/shared/header";

export const metadata: Metadata = {
  title: "PIZZAHUB | Главная",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
    <Suspense>
      <Header/>
    </Suspense>
    {children}
    {modal}
    </main>
  );
}
