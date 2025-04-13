'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Api } from '@/shared/services/api-client'; // Импорт вашего API
import { Title } from '.';
import { Order } from '@/@types/order';
import { ReadyStatus } from '@prisma/client';
import { updateReadyStatusOrder } from '@/app/actions';

import { PizzaSize, PizzaType, mapPizzaSize, mapPizzaType } from '@/shared/constants';

// Определение стилей, чтобы избежать повторений
const rowClasses = "py-4 px-2 border-b border-orange-500 text-center"; // Центрируем текст
const selectClasses = "border border-orange-500 rounded p-1 w-full"; // Ширина select на 100%

export const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await Api.orders.getAllOrders();
                setOrders(response); 
            } catch (error) {
                console.error("Ошибка при получении заказов:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: ReadyStatus) => {
        try {
            // Используем импортированную функцию для обновления статуса
            await updateReadyStatusOrder(orderId, newStatus);
            
            // Обновляем состояние заказа локально
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, resultStatus: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Ошибка при обновлении статуса заказа:", error);
        }
    };

    if (loading) {
        return <Title text="Загрузка заказов..." />;
    }

    if (!orders || orders.length === 0) {
        return <Title text="Нет заказов для отображения." />;
    }
    return (
        <div className="p-6 overflow-auto">
            <table className="min-w-full bg-white border border-orange-500">
                <thead>
                    <tr className="bg-orange-500 text-white">
                        <th className={rowClasses}>ID</th>
                        <th className={rowClasses}>Имя клиента</th>
                        <th className={rowClasses}>Состав заказа</th>
                        <th className={rowClasses}>Адрес</th>
                        <th className={rowClasses}>Телефон</th>
                        <th className={rowClasses}>Email</th>
                        <th className={rowClasses}>Комментарий</th>
                        <th className={rowClasses}>Статус</th>
                        <th className={rowClasses}>Сумма</th>
                        <th className={rowClasses}>Дата создания</th>
                    </tr>
                </thead>
                <tbody> 
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-orange-100">
                            <td className={rowClasses}>{order.id}</td>
                            <td className={rowClasses}>{order.fullName}</td>
                            <td className={rowClasses}>
                            {JSON.parse(String(order.items) || '[]').map((item: { productItem: { pizzaType: PizzaType; size: PizzaSize; product: { name: React.Key | null | undefined; }; }; ingredients: any[]; quantity: string; }) => (
                                <span key={item.productItem.product.name}>
                                    {item.productItem.product.name}
                                    {item.ingredients.length !== 0 ? (
                                        ` ( ${item.ingredients.map((ingredient) => ingredient.name).join(", ")} ) х ${item.quantity} 
                                        [ Тесто: ${mapPizzaType[item.productItem.pizzaType]} ] 
                                        [ Размер: ${mapPizzaSize[item.productItem.size]} ]`
                                    ) : " "}
                                    <br /><br />
                                </span>
                            ))}
                            </td>
                            <td className={rowClasses}>{order.address}</td>
                            <td className={rowClasses}>{order.phone}</td>
                            <td className={rowClasses}>{order.email}</td>
                            <td className={rowClasses}>{order.comment === "" ? "-" : order.comment}</td>
                            <td className={rowClasses}>
                                <select
                                    className={selectClasses}
                                    value={order.resultStatus}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as ReadyStatus)}
                                >
                                    <option value={ReadyStatus.NEW}>Новый</option>
                                    <option value={ReadyStatus.INPROGRES}>В процессе</option>
                                    <option value={ReadyStatus.READY}>Готов</option>
                                    <option value={ReadyStatus.INDELIVERY}>В доставке</option>
                                    <option value={ReadyStatus.COMPLETED}>Завершён</option>
                                    <option value={ReadyStatus.CANCELLED}>Ошибка</option>
                                </select>
                            </td>
                            <td className={rowClasses}>{order.totalAmount}</td>
                            <td className={rowClasses}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};