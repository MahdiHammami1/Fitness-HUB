import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'wouhouch_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, variant?: ProductVariant, qty: number = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        toast.success(`Updated ${product.title} quantity`);
        return updated;
      }

      toast.success(`Added ${product.title} to cart`);
      return [...prev, { product, variant, qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.variant?.id === variantId)
    ));
    toast.success('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.variant?.id === variantId) {
        return { ...item, qty };
      }
      return item;
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
