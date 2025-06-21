import React, { useState } from 'react';
import { ArrowLeft, MapPin, User, Mail, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { CartItem, Product, CustomerInfo, Order } from '../types';
import { formatCurrency } from '../utils/freight';
import { fetchCep } from '../services/cep';
import { useOrders } from '../hooks/useOrders';

interface CheckoutFormProps {
  cart: CartItem[];
  products: Product[];
  totals: { subtotal: number; freight: number; total: number };
  onComplete: () => void;
  onCancel: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  products,
  totals,
  onComplete,
  onCancel
}) => {
  const { saveOrder } = useOrders();
  const [step, setStep] = useState<'customer' | 'address' | 'payment' | 'success'>('customer');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });

  const handleCepSearch = async (cep: string) => {
    if (cep.length !== 8) return;
    
    setCepLoading(true);
    const cepData = await fetchCep(cep);
    
    if (cepData) {
      setCustomerInfo(prev => ({
        ...prev,
        address: {
          ...prev.address,
          cep: cepData.cep,
          street: cepData.logradouro,
          neighborhood: cepData.bairro,
          city: cepData.localidade,
          state: cepData.uf
        }
      }));
    } else {
      alert('CEP não encontrado. Verifique e tente novamente.');
    }
    setCepLoading(false);
  };

  const handleFinishOrder = async () => {
    setLoading(true);
    
    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      items: cart,
      subtotal: totals.subtotal,
      freight: totals.freight,
      discount: 0,
      total: totals.total,
      customerInfo,
      status: 'pending'
    };

    const savedOrder = saveOrder(order);
    
    // Simulate processing time
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      
      // Complete after showing success
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  const getProductInfo = (productId: string, variationId: string) => {
    const product = products.find(p => p.id === productId);
    const variation = product?.variations.find(v => v.id === variationId);
    return { product, variation };
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-4">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>
          <div className="text-sm text-gray-500">
            Redirecionando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Carrinho
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Finalizar Pedido</h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'customer' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Dados Pessoais
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <button
                    onClick={() => setStep('address')}
                    disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 'address' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customerInfo.address.cep}
                        onChange={(e) => {
                          const cep = e.target.value.replace(/\D/g, '');
                          setCustomerInfo(prev => ({
                            ...prev,
                            address: { ...prev.address, cep }
                          }));
                          if (cep.length === 8) {
                            handleCepSearch(cep);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00000000"
                        maxLength={8}
                        required
                      />
                      {cepLoading && (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.street}
                        onChange={(e) => setCustomerInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.number}
                        onChange={(e) => setCustomerInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, number: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento (opcional)
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address.complement}
                      onChange={(e) => setCustomerInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, complement: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.neighborhood}
                        onChange={(e) => setCustomerInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, neighborhood: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.city}
                        onChange={(e) => setCustomerInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('customer')}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      disabled={!customerInfo.address.cep || !customerInfo.address.street || !customerInfo.address.number}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagamento
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Simulação de Pagamento</strong><br />
                      Este é um sistema de demonstração. O pagamento não será processado de fato.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('address')}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleFinishOrder}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        'Finalizar Pedido'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => {
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

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
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
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};