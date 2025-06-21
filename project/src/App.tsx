import React, { useState } from 'react';
import { Package, ShoppingCart, Tag, FileText, Store } from 'lucide-react';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { CouponForm } from './components/CouponForm';
import { CouponList } from './components/CouponList';
import { Cart } from './components/Cart';
import { OrderList } from './components/OrderList';
import { CheckoutForm } from './components/CheckoutForm';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useOrders } from './hooks/useOrders';
import { Product, CartItem } from './types';

type TabType = 'products' | 'coupons' | 'orders' | 'cart';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [showCheckout, setShowCheckout] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { products, stock, saveProduct, updateProduct, updateStock } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { coupons, saveCoupon } = useCoupons();
  const { orders, saveOrder } = useOrders();

  const handleAddToCart = (productId: string, variationId: string, price: number) => {
    const stockInfo = stock.find(s => s.productId === productId && s.variationId === variationId);
    
    if (!stockInfo || stockInfo.available <= 0) {
      alert('Produto indisponível no estoque!');
      return;
    }

    const cartItem: CartItem = {
      productId,
      variationId,
      quantity: 1,
      price
    };

    addToCart(cartItem);
    
    // Update stock
    updateStock(productId, variationId, stockInfo.quantity - 1);
    
    // Switch to cart tab to show feedback
    setActiveTab('cart');
  };

  const handleCheckout = (couponCode?: string, discount?: number) => {
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setShowCheckout(false);
    setActiveTab('orders');
  };

  const tabs = [
    { id: 'products' as TabType, label: 'Produtos', icon: Package, count: products.length },
    { id: 'coupons' as TabType, label: 'Cupons', icon: Tag, count: coupons.length },
    { id: 'orders' as TabType, label: 'Pedidos', icon: FileText, count: orders.length },
    { id: 'cart' as TabType, label: 'Carrinho', icon: ShoppingCart, count: cart.length }
  ];

  if (showCheckout) {
    return (
      <CheckoutForm
        cart={cart}
        products={products}
        totals={getCartTotal()}
        onComplete={handleOrderComplete}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Store className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Mini ERP</h1>
            </div>
            <div className="text-sm text-gray-500">
              Sistema de Gestão Comercial
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProductForm 
                onSubmit={saveProduct}
                editingProduct={editingProduct}
                onCancelEdit={() => setEditingProduct(null)}
              />
            </div>
            <div className="lg:col-span-2">
              <ProductList
                products={products}
                stock={stock}
                onAddToCart={handleAddToCart}
                onEditProduct={setEditingProduct}
              />
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CouponForm onSubmit={saveCoupon} />
            </div>
            <div className="lg:col-span-2">
              <CouponList coupons={coupons} />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrderList orders={orders} products={products} />
        )}

        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto">
            <Cart
              cart={cart}
              products={products}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onCheckout={handleCheckout}
              totals={getCartTotal()}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;