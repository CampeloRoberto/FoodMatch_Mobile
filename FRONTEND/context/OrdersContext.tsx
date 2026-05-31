import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Order, CartItem } from "@/types";

interface AddOrderParams {
  restaurantId: number;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  total: number;
  address: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (params: AddOrderParams) => Promise<Order>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    apiFetch<Order[]>("/orders", { auth: true })
      .then(setOrders)
      .catch(console.error);
  }, [user]);

  const addOrder = async ({
    restaurantId,
    items,
    address,
  }: AddOrderParams): Promise<Order> => {
    const order = await apiFetch<Order>("/orders", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        restaurantId,
        address,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.menuItem.price,
        })),
      }),
    });
    setOrders((prev) => [order, ...prev]);
    return order;
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
