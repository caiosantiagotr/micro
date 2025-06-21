import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { storage } from '../utils/storage';
import { calculateFreight } from '../utils/freight';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = storage.getCart();
    setCart(savedCart);
  }, []);

  const addToCart = (item: CartItem) => {
    const existingItem = cart.find(
      cartItem => cartItem.productId === item.productId && cartItem.variationId === item.variationId
    );

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        cartItem.productId === item.productId && cartItem.variationId === item.variationId
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      updatedCart = [...cart, item];
    }

    setCart(updatedCart);
    storage.saveCart(updatedCart);
  };

  const removeFromCart = (productId: string, variationId: string) => {
    const updatedCart = cart.filter(
      item => !(item.productId === productId && item.variationId === variationId)
    );
    setCart(updatedCart);
    storage.saveCart(updatedCart);
  };

  const updateQuantity = (productId: string, variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.productId === productId && item.variationId === variationId
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
    storage.saveCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    storage.clearCart();
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const freight = calculateFreight(subtotal);
    return { subtotal, freight, total: subtotal + freight };
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };
};