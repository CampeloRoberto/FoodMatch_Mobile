import "../global.css";
import { useEffect, type ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const isLoginScreen = (segments[0] as string) === "login";
    if (!user && !isLoginScreen) {
      router.replace("/login" as never);
    } else if (user && isLoginScreen) {
      router.replace("/");
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#ff4757" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <CartProvider>
                  <AuthGate>
                    <Stack screenOptions={{ headerShown: false }} />
                  </AuthGate>
                </CartProvider>
              </OrdersProvider>
            </FavoritesProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
