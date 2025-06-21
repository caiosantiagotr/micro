export interface Product {
  id: string;
  name: string;
  price: number;
  variations: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  stock: number;
  price?: number; // Optional price override
}

export interface CartItem {
  productId: string;
  variationId: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minValue: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  freight: number;
  discount: number;
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export interface Stock {
  productId: string;
  variationId: string;
  quantity: number;
  reserved: number; // Reserved for pending orders
  available: number; // Available for sale
}