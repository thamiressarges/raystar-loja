'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isCheckoutOpen: boolean;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('raystar-cart');
    if (storedCart) {
      try { setItems(JSON.parse(storedCart)); } catch (error) { console.error(error); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('raystar-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const openCheckoutModal = () => { setIsOpen(false); setIsCheckoutOpen(true); };
  const closeCheckoutModal = () => setIsCheckoutOpen(false);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItemQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen, isCheckoutOpen, openCheckoutModal, closeCheckoutModal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
}