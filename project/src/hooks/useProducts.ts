import { useState, useEffect } from 'react';
import { Product, ProductVariation, Stock } from '../types';
import { storage } from '../utils/storage';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    const savedProducts = storage.getProducts();
    const savedStock = storage.getStock();
    setProducts(savedProducts);
    setStock(savedStock);
  }, []);

  const saveProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);

    // Create stock entries for each variation
    const newStockEntries: Stock[] = product.variations.map(variation => ({
      productId: newProduct.id,
      variationId: variation.id,
      quantity: variation.stock,
      reserved: 0,
      available: variation.stock
    }));

    const updatedStock = [...stock, ...newStockEntries];
    setStock(updatedStock);
    storage.saveStock(updatedStock);

    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);
  };

  const updateStock = (productId: string, variationId: string, quantity: number) => {
    const updatedStock = stock.map(stockItem =>
      stockItem.productId === productId && stockItem.variationId === variationId
        ? { ...stockItem, quantity, available: quantity - stockItem.reserved }
        : stockItem
    );
    setStock(updatedStock);
    storage.saveStock(updatedStock);
  };

  const getStock = (productId: string, variationId: string): Stock | undefined => {
    return stock.find(s => s.productId === productId && s.variationId === variationId);
  };

  return {
    products,
    stock,
    saveProduct,
    updateProduct,
    updateStock,
    getStock
  };
};