import React from 'react';
import { FileText, Calendar, Package, User, MapPin } from 'lucide-react';
import { Order, Product } from '../types';
import { formatCurrency, formatDate } from '../utils/freight';

interface OrderListProps {
  orders: Order[];
  products: Product[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders, products }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getProductInfo = (productId: string, variationId: string) => {
    const product = products.find(p => p.id === productId);
    const variation = product?.variations.find(v => v.id === variationId);
    return { product, variation };
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum pedido encontrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Pedidos ({orders.length})
        </h2>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pedido #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Cliente
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nome:</strong> {order.customerInfo.name}</p>
                  <p><strong>Email:</strong> {order.customerInfo.email}</p>
                  <p><strong>Telefone:</strong> {order.customerInfo.phone}</p>
                </div>

                <h4 className="font-medium text-gray-900 mt-4 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Endereço de Entrega
                </h4>
                <div className="text-sm text-gray-600">
                  <p>
                    {order.customerInfo.address.street}, {order.customerInfo.address.number}
                    {order.customerInfo.address.complement && `, ${order.customerInfo.address.complement}`}
                  </p>
                  <p>{order.customerInfo.address.neighborhood}</p>
                  <p>
                    {order.customerInfo.address.city} - {order.customerInfo.address.state}
                  </p>
                  <p>CEP: {order.customerInfo.address.cep}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido</h4>
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => {
                    const { product, variation } = getProductInfo(item.productId, item.variationId);
                    return (
                      <div key={`${item.productId}-${item.variationId}`} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product?.name}</p>
                          <p className="text-gray-600">{variation?.name}</p>
                          <p className="text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span className={order.freight === 0 ? 'text-green-600 font-medium' : ''}>
                      {order.freight === 0 ? 'Grátis' : formatCurrency(order.freight)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-1 flex justify-between font-semibold text-base">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};