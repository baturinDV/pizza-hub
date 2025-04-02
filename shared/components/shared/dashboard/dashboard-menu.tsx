'use client';

import React from 'react';
import { Folder, LayoutDashboard, Leaf, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface Props {
  className?: string;
  onSelect?: () => void; // Добавляем prop для колбэка при выборе
}

function isSubPath(subPath: string, parentPath: string) {
  if (subPath === '/dashboard' && parentPath === '/dashboard') {
    return true;
  }
  return subPath !== '/dashboard' && (subPath === parentPath || parentPath.startsWith(subPath));
}

const items = [
  {
    text: 'Пользователи',
    icon: <Users size={16} />,
    href: '/dashboard/users',
  },
  {
    text: 'Категории',
    icon: <Folder size={16} />,
    href: '/dashboard/categories',
  },
  {
    text: 'Продукты',
    icon: <Package size={16} />,
    href: '/dashboard/products',
  },
  {
    text: 'Вариации',
    icon: <LayoutDashboard size={16} />,
    href: '/dashboard/product-items',
  },
  {
    text: 'Ингредиенты',
    icon: <Leaf size={16} />,
    href: '/dashboard/ingredients',
  },
  {
    text: 'Заказы',
    icon: <ShoppingCart size={16} />,
    href: '/dashboard/orders',
  },
];

export const DashboardMenu: React.FC<Props> = ({ className, onSelect }) => {
  return (
    <nav
      className={cn(
        'grid items-start px-8 font-sans text-sm',
        'place-items-left',
        'md:text-base',
        'w-full',
        className
      )}
    >
      {items.map((item) => (
        <Link
          key={item.text}
          className={cn(
            'flex gap-3 rounded-[8px] px-3 py-2 text-gray-900 transition-all',
            'hover:text-primary p-2 px-4 cursor-pointer rounded-md',
            'text-xl'
          )}
          href={item.href}
          onClick={() => { // Добавляем обработчик клика
            if (onSelect) {
                onSelect(); // Вызываем переданный метод для закрытия
            }
          }}
        >
          {item.icon}
          {item.text}
        </Link>
      ))}
    </nav>
  );
};