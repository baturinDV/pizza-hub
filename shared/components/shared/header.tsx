'use client'
import React from 'react';
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

interface Props {
    hasSearch?: boolean;
    hasCart?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className}) => {
    const [openAuthModel, setOpenAuthModel] = React.useState(false);
    const searchParams = useSearchParams();
    React.useEffect(() => {
        if(searchParams.has('paid')){
            setTimeout(() => {
                toast.success('Заказ успешно оплачен! Информация отправлена на почту. ');
            }, 500);
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

                    <AuthModel open={openAuthModel} onClose={() => setOpenAuthModel(false)} /> 
                    <ProfileButton onClickOpenModel={() => setOpenAuthModel(true)}  /> 
                    {hasCart && <CartButton />}
                </div>
            </Container>
        </header>
    );
};