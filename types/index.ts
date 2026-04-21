export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  distance: string;
  category: string;
  priceRange: string;
  image: string;
}

export interface RestaurantDetail {
  restaurantId: number;
  address: string;
  phone: string;
  hours: string;
  description: string;
}

export type MenuCategory = "Entradas" | "Pratos Principais" | "Bebidas" | "Sobremesas";

export interface MenuItem {
  id: number;
  restaurantId: number;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Review {
  id: number;
  restaurantId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "entregue" | "cancelado" | "em andamento";

export interface Order {
  id: string;
  restaurantId: number;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}
