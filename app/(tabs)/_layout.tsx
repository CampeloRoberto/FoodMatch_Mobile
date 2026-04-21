import { Tabs } from "expo-router";
import { View, Text, Platform, Dimensions, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Heart, MapPin, User, ClipboardList } from "lucide-react-native";
import { useCart } from "@/context/CartContext";

function getAndroidNavBarHeight() {
  if (Platform.OS !== "android") return 0;
  const screenHeight = Dimensions.get("screen").height;
  const windowHeight = Dimensions.get("window").height;
  const statusBarHeight = StatusBar.currentHeight ?? 0;
  return Math.max(0, screenHeight - windowHeight - statusBarHeight);
}

function CartBadge() {
  const { itemCount } = useCart();
  if (!itemCount) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -8,
        backgroundColor: "#ff4747",
        borderRadius: 999,
        minWidth: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
        {itemCount > 9 ? "9+" : itemCount}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const androidNavBar = getAndroidNavBarHeight();
  const bottomInset = Math.max(insets.bottom, androidNavBar);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ff4747",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          borderTopWidth: 1,
          height: 64 + bottomInset,
          paddingBottom: 8 + bottomInset,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <View>
              <ClipboardList color={color} size={size} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
