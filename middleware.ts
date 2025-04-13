// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Проверяем, начинается ли путь с /dashboard
    if (path.startsWith('/dashboard')) {
      // Проверяем, имеет ли пользователь роль ADMIN
      if (token?.role !== UserRole.ADMIN) {
        // Если не администратор, перенаправляем на страницу с ошибкой доступа
        return NextResponse.redirect(new URL('/not-admin', req.url));
      }
    }
    
    // Если все проверки пройдены, разрешаем доступ
    return NextResponse.next();
  },
  {
    callbacks: {
      // Функция authorized вызывается перед middleware
      authorized: ({ token }) => !!token
    }
  }
);

// Указываем пути, для которых должен применяться middleware
export const config = {
  matcher: ['/dashboard/:path*']
};
