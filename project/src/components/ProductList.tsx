import React from 'react';
import { ShoppingCart, Package, Edit } from 'lucide-react';
import { Product, Stock } from '../types';
import { formatCurrency } from '../utils/freight';

interface ProductListProps {
  products: Product[];
  stock: Stock[];
  onAddToCart: (productId: string, variationId: string, price: number) => void;
  onEditProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  stock, 
  onAddToCart, 
  onEditProduct 
}) => {
  const getStockForVariation = (productId: string, variationId: string) => {
    return stock.find(s => s.productId === productId && s.variationId === variationId);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <button
                onClick={() => onEditProduct(product)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-lg font-bold text-blue-600 mb-4">
              {formatCurrency(product.price)}
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Variações:</h4>
              {product.variations.map((variation) => {
                const stockInfo = getStockForVariation(product.id, variation.id);
                const availableStock = stockInfo?.available || 0;
                const isOutOfStock = availableStock <= 0;

                return (
                  <div key={variation.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {variation.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-600' 
                            : availableStock < 10 
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-green-100 text-green-600'
                        }`}>
                          {availableStock} em estoque
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAddToCart(product.id, variation.id, variation.price || product.price)}
                      disabled={isOutOfStock}
                      className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                        isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {isOutOfStock ? 'Indisponível' : 'Comprar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};