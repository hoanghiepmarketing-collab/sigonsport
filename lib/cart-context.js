'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'sigonsport_cart';

// Reducer xử lý các action của giỏ hàng
function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD': {
      return action.payload;
    }
    case 'ADD_ITEM': {
      const { item } = action;
      const existingIndex = state.findIndex(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existingIndex >= 0) {
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + (item.qty || 1),
        };
        return updated;
      }
      return [...state, { ...item, qty: item.qty || 1 }];
    }
    case 'REMOVE_ITEM': {
      return state.filter(
        (i) => !(i.id === action.id && i.size === action.size && i.color === action.color)
      );
    }
    case 'UPDATE_QTY': {
      return state.map((i) => {
        if (i.id === action.id && i.size === action.size && i.color === action.color) {
          return { ...i, qty: Math.max(1, action.qty) };
        }
        return i;
      });
    }
    case 'CLEAR': {
      return [];
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load từ localStorage khi mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
      }
    } catch {
      // Bỏ qua lỗi parse
    }
  }, []);

  // Lưu vào localStorage mỗi khi items thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Bỏ qua lỗi storage
    }
  }, [items]);

  function addItem(item) {
    dispatch({ type: 'ADD_ITEM', item });
  }

  function removeItem(id, size, color) {
    dispatch({ type: 'REMOVE_ITEM', id, size, color });
  }

  function updateQty(id, size, color, qty) {
    dispatch({ type: 'UPDATE_QTY', id, size, color, qty });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' });
  }

  function total() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải dùng bên trong CartProvider');
  return ctx;
}
