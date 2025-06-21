import { Product, Order, Coupon, Stock } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'erp_products',
  ORDERS: 'erp_orders',
  COUPONS: 'erp_coupons',
  STOCK: 'erp_stock',
  CART: 'erp_cart'
};

export const storage = {
  // Products
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Orders
  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  saveOrders: (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Coupons
  getCoupons: (): Coupon[] => {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return data ? JSON.parse(data) : [];
  },

  saveCoupons: (coupons: Coupon[]) => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  },

  // Stock
  getStock: (): Stock[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STOCK);
    return data ? JSON.parse(data) : [];
  },

  saveStock: (stock: Stock[]) => {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  },

  // Cart
  getCart: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  saveCart: (cart: any[]) => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clearCart: () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }
};