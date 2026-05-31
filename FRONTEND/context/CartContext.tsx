import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem, MenuItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string;
  restaurantImage: string;
  addItem: (item: MenuItem, restaurantId: number, restaurantName: string, restaurantImage: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantImage, setRestaurantImage] = useState("");

  const addItem = (menuItem: MenuItem, rId: number, rName: string, rImage: string) => {
    if (restaurantId !== null && restaurantId !== rId) {
      setItems([{ menuItem, quantity: 1 }]);
      setRestaurantId(rId);
      setRestaurantName(rName);
      setRestaurantImage(rImage);
      return;
    }
    setRestaurantId(rId);
    setRestaurantName(rName);
    setRestaurantImage(rImage);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.menuItem.id !== menuItemId);
      if (!next.length) {
        setRestaurantId(null);
        setRestaurantName("");
        setRestaurantImage("");
      }
      return next;
    });
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName("");
    setRestaurantImage("");
  };

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, restaurantName, restaurantImage, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
