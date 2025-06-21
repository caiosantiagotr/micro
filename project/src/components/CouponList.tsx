import React from 'react';
import { Tag, Calendar, DollarSign, Percent, AlertCircle } from 'lucide-react';
import { Coupon } from '../types';
import { formatCurrency, formatDate } from '../utils/freight';

interface CouponListProps {
  coupons: Coupon[];
}

export const CouponList: React.FC<CouponListProps> = ({ coupons }) => {
  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.isActive) return 'bg-gray-100 text-gray-600';
    if (new Date(coupon.expiresAt) < new Date()) return 'bg-red-100 text-red-600';
    return 'bg-green-100 text-green-600';
  };

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.isActive) return 'Inativo';
    if (new Date(coupon.expiresAt) < new Date()) return 'Expirado';
    return 'Ativo';
  };

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum cupom cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Cupons Cadastrados ({coupons.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{coupon.code}</h3>
                  <p className="text-sm text-gray-500">
                    Criado em {formatDate(coupon.createdAt)}
                  </p>
                </div>
              </div>
              
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon)}`}>
                {getStatusText(coupon)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                {coupon.discountType === 'percentage' ? (
                  <Percent className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                )}
                <span>
                  Desconto: {coupon.discountType === 'percentage' 
                    ? `${coupon.discount}%` 
                    : formatCurrency(coupon.discount)}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span>Min: {formatCurrency(coupon.minValue)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                <span>Expira: {formatDate(coupon.expiresAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};