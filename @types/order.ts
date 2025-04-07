import { ReadyStatus } from "@prisma/client";

export interface Order {
    id: number;
    fullName: string;
    resultStatus: ReadyStatus;
    totalAmount: number;
    phone: string; 
    address: string; 
    email: string; 
    comment: string; 
    createdAt: string; 
    items: JSON;
    
}