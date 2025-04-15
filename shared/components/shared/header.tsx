'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Container } from './container';
import { SearchInput } from './search-input';
import Image from 'next/image';
import { CartButton } from './cart-button';
import { AuthModel } from './modals/auth-model';
import { ProfileButton } from './profile-button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { DashboardButton } from '.';
import { useIsAdminStore } from '@/shared/store';
import { Api } from '@/shared/services/api-client';

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className}) => {
    const router = useRouter();
    const [openAuthModel, setOpenAuthModel] = React.useState(false);
    const searchParams = useSearchParams();
    const isAdminState = useIsAdminStore((state) => state.isAdmin);
    const [isAdmin, setIsAdmin] = useState(false);

    async function fetchIsAdmin() {
        const response = await Api.checkAuth.isAdmin();
        setIsAdmin(response.isAdmin);
    }

    useEffect(() => {
        fetchIsAdmin();
    }, []);

    React.useEffect(() => {
        
        let toastMessage = '';

        if (searchParams.has('verified')) {
        toastMessage = 'Почта успешно подтверждена!';
        }

        if (searchParams.has('paid')) {
        toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.';
        }

        if (toastMessage) {
        setTimeout(() => {
            router.replace('/');
            toast.success(toastMessage, {
            duration: 3000,
            });
        }, 1000);
        }
    }, [])

    return (
        <header className={cn("border-b", className)}>
            <Container className="flex items-center justify-between py-8">
                {/* Левая часть*/}
                    <Link href="/">
                        <div className="flex items-center gap-4">
                            <Image src="/logo.png" alt="Logo" width={35} height={35}/>
                            <div>
                                <h1 className="text-2xl uppercase font-black">PIZZAHUB</h1>
                                <p className="text-sm text-gray-400 leading-3">ВКУСНЕЙ УЖЕ НЕКУДА</p>
                            </div>
                        </div>
                    </Link>
            

                {/* Поиск*/}
                {hasSearch && <div className="mx-10 flex-1">
                    <SearchInput />
                </div>
                }
            
                {/* Правая часть*/}
                <div className="flex items-center gap-3">
                    {/* Можно отобразить скелетон при загрузке */}
                    
                    {(isAdmin || isAdminState) && <DashboardButton />}
                    <AuthModel open={openAuthModel} onClose={() => setOpenAuthModel(false)} /> 
                    <ProfileButton onClickOpenModel={() => setOpenAuthModel(true)}  /> 
                    {hasCart && <CartButton />}
                </div>
            </Container>
        </header>
    );
};