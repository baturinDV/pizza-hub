'use client'

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
  onChange?: (value?: string) => void;
}


export const AddressInput: React.FC<Props> = ({ onChange}) => {
    return (
        <AddressSuggestions 
            token="a61f2fe6802afaa98d37c2e0b39f9d44bd34e5f2" 
            onChange={(data) => onChange?.(data?.value)} 
        />
    )
};
