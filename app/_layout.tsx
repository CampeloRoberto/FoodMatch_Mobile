import "../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserPreferencesProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <CartProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </CartProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
