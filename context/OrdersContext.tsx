import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Order, CartItem } from "@/types";
import { initialOrders } from "@/data/orders";

interface OrdersContextType {
  orders: Order[];
  addOrder: (params: {
    restaurantId: number;
    restaurantName: string;
    restaurantImage: string;
    items: CartItem[];
    total: number;
    address: string;
  }) => Order;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);
const STORAGE_KEY = "@foodmatch:orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed: Order[] = JSON.parse(stored);
          if (parsed.length) setOrders(parsed);
        } catch {}
      }
    });
  }, []);

  const persist = (list: Order[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addOrder = ({
    restaurantId,
    restaurantName,
    restaurantImage,
    items,
    total,
    address,
  }: {
    restaurantId: number;
    restaurantName: string;
    restaurantImage: string;
    items: CartItem[];
    total: number;
    address: string;
  }): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      restaurantId,
      restaurantName,
      restaurantImage,
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price,
      })),
      total,
      status: "entregue",
      date: new Date().toISOString(),
      address,
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      persist(next);
      return next;
    });
    return newOrder;
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
