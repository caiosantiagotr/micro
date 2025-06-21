import { useState, useEffect } from 'react';
import { Coupon } from '../types';
import { storage } from '../utils/storage';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const savedCoupons = storage.getCoupons();
    setCoupons(savedCoupons);
  }, []);

  const saveCoupon = (coupon: Omit<Coupon, 'id' | 'createdAt'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedCoupons = [...coupons, newCoupon];
    setCoupons(updatedCoupons);
    storage.saveCoupons(updatedCoupons);
    return newCoupon;
  };

  const validateCoupon = (code: string, subtotal: number): { isValid: boolean; coupon?: Coupon; error?: string } => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { isValid: false, error: 'Cupom não encontrado' };
    }

    if (!coupon.isActive) {
      return { isValid: false, error: 'Cupom inativo' };
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return { isValid: false, error: 'Cupom expirado' };
    }

    if (subtotal < coupon.minValue) {
      return { isValid: false, error: `Valor mínimo de R$ ${coupon.minValue.toFixed(2)} não atingido` };
    }

    return { isValid: true, coupon };
  };

  const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discount) / 100;
    }
    return Math.min(coupon.discount, subtotal);
  };

  return {
    coupons,
    saveCoupon,
    validateCoupon,
    calculateDiscount
  };
};