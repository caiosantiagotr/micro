import { useState, useEffect } from 'react';
import { Order } from '../types';
import { storage } from '../utils/storage';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('erp_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('erp_orders', JSON.stringify(updatedOrders));
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('erp_orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('erp_orders', JSON.stringify(updatedOrders));
  };

  return {
    orders,
    saveOrder,
    updateOrderStatus,
    deleteOrder
  };
};