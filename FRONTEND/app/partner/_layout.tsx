import { Tabs } from "expo-router";
import { Platform, Dimensions, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChefHat, ClipboardList, Store, TrendingUp } from "lucide-react-native";

function getAndroidNavBarHeight() {
  if (Platform.OS !== "android") return 0;
  const screenHeight = Dimensions.get("screen").height;
  const windowHeight = Dimensions.get("window").height;
  const statusBarHeight = StatusBar.currentHeight ?? 0;
  return Math.max(0, screenHeight - windowHeight - statusBarHeight);
}

export default function PartnerTabsLayout() {
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
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: "Cardápio",
          tabBarIcon: ({ color, size }) => <ChefHat color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="restaurant"
        options={{
          title: "Restaurante",
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: "Balanço",
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
