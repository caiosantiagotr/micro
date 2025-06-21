import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Tag } from 'lucide-react';
import { CartItem, Product } from '../types';
import { formatCurrency } from '../utils/freight';
import { useCoupons } from '../hooks/useCoupons';

interface CartProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, variationId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variationId: string) => void;
  onCheckout: (couponCode?: string, discount?: number) => void;
  totals: { subtotal: number; freight: number; total: number };
}

export const Cart: React.FC<CartProps> = ({
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totals
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const { validateCoupon, calculateDiscount } = useCoupons();

  const getProductInfo = (productId: string, variationId: string) => {
    const product = products.find(p => p.id === productId);
    const variation = product?.variations.find(v => v.id === variationId);
    return { product, variation };
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    const validation = validateCoupon(couponCode.trim(), totals.subtotal);
    
    if (validation.isValid && validation.coupon) {
      const discount = calculateDiscount(validation.coupon, totals.subtotal);
      setAppliedCoupon({ code: couponCode.trim(), discount });
      setCouponError('');
      setCouponCode('');
    } else {
      setCouponError(validation.error || 'Erro ao aplicar cupom');
      setAppliedCoupon(null);
    }
  };

  const finalTotal = totals.total - (appliedCoupon?.discount || 0);

  const handleCheckout = () => {
    onCheckout(appliedCoupon?.code, appliedCoupon?.discount);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {cart.map((item) => {
          const { product, variation } = getProductInfo(item.productId, item.variationId);
          
          return (
            <div key={`${item.productId}-${item.variationId}`} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product?.name}</h3>
                  <p className="text-sm text-gray-600">{variation?.name}</p>
                  <p className="text-sm font-medium text-blue-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.productId, item.variationId)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-right text-sm text-gray-600">
                Total: {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {/* Coupon Section */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Código do cupom"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Tag className="w-4 h-4 mr-1" />
              Aplicar
            </button>
          </div>

          {couponError && (
            <p className="text-sm text-red-600">{couponError}</p>
          )}

          {appliedCoupon && (
            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
              <span className="text-sm text-green-700">
                Cupom "{appliedCoupon.code}" aplicado
              </span>
              <span className="text-sm font-medium text-green-700">
                -{formatCurrency(appliedCoupon.discount)}
              </span>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Frete:</span>
            <span className={totals.freight === 0 ? 'text-green-600 font-medium' : ''}>
              {totals.freight === 0 ? 'Grátis' : formatCurrency(totals.freight)}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Desconto:</span>
              <span>-{formatCurrency(appliedCoupon.discount)}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};