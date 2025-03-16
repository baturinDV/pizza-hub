import React from 'react';
import { Input, Textarea } from '../../ui';
import { WhiteBlock } from '../white-block';

interface Props {
    className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className}) => {
    return (
        <WhiteBlock title="3. Адрес доставки">
            <div className="flex flex-col gap-5">
                <Input name="first name" className="text-base" placeholder="Введите адрес..."></Input>
                <Textarea className="text-base" placeholder="Комментарий к заказу" rows={5}></Textarea>
            </div>
        </WhiteBlock>
    );
};