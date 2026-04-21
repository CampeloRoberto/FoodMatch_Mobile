import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, ClipboardList, Home } from "lucide-react-native";
import { useOrders } from "@/context/OrdersContext";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
      {/* Animated check */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#dcfce7",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <CheckCircle size={56} color="#22c55e" fill="#22c55e" />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim, alignItems: "center" }}>
        <Text className="text-2xl font-bold text-foreground dark:text-white text-center">
          Pedido confirmado!
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 text-base leading-6">
          Seu pedido foi recebido e está sendo preparado com carinho.
        </Text>

        {order && (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mt-6 w-full gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Pedido</Text>
              <Text className="font-semibold text-foreground dark:text-white text-sm">{order.id}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Restaurante</Text>
              <Text className="font-semibold text-foreground dark:text-white text-sm flex-1 text-right ml-4" numberOfLines={1}>
                {order.restaurantName}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Total pago</Text>
              <Text className="font-bold text-primary text-sm">
                R$ {order.total.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Entrega em</Text>
              <Text className="font-semibold text-foreground dark:text-white text-sm" numberOfLines={1}>
                {order.address.split("–")[0].trim()}
              </Text>
            </View>
          </View>
        )}

        {/* Estimated time */}
        <View
          style={{
            backgroundColor: "#fef3c7",
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 12,
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 20 }}>🛵</Text>
          <View>
            <Text style={{ fontWeight: "700", color: "#92400e", fontSize: 14 }}>
              Tempo estimado de entrega
            </Text>
            <Text style={{ color: "#b45309", fontSize: 22, fontWeight: "800" }}>
              30–45 min
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="w-full gap-3 mt-8">
          <Pressable
            onPress={() => router.replace("/(tabs)/orders")}
            className="bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
          >
            <ClipboardList size={20} color="#fff" />
            <Text className="text-white font-bold text-base">Ver meus pedidos</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/")}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl py-4 flex-row items-center justify-center gap-2"
          >
            <Home size={20} color="#6b7280" />
            <Text className="text-gray-600 dark:text-gray-300 font-semibold text-base">
              Voltar ao início
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
