import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
// Local Product type to avoid dependency on shared types
export interface Product {
  id: string;
  name: string;
  price?: number;
  unitOptions: Array<'box' | 'pcs'>;
  active: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (input: Omit<Product, 'id'> & Partial<Pick<Product, 'id'>>) => Product;
  updateProduct: (productId: string, updates: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_KEY = 'products';

const defaultProducts: Product[] = [
  { id: 'p1', name: 'Whisky - Premium Blend', price: 1500, unitOptions: ['box', 'pcs'], active: true },
  { id: 'p2', name: 'Vodka - Classic', price: 1200, unitOptions: ['box', 'pcs'], active: true },
  { id: 'p3', name: 'Beer - Lager Case', price: 800, unitOptions: ['box'], active: true },
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Simple unique ID generator
  const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) return JSON.parse(saved) as Product[];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct: ProductContextType['addProduct'] = (input) => {
    const id = input.id || generateId();
    const product: Product = {
      id,
      name: input.name,
      price: input.price ?? undefined,
      unitOptions: input.unitOptions && input.unitOptions.length > 0 ? input.unitOptions : ['box', 'pcs'],
      active: input.active ?? true,
    };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct: ProductContextType['updateProduct'] = (productId, updates) => {
    setProducts(prev => prev.map(p => (p.id === productId ? { ...p, ...updates } : p)));
  };

  const deleteProduct: ProductContextType['deleteProduct'] = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const value = useMemo(() => ({ products, addProduct, updateProduct, deleteProduct }), [products]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
};
