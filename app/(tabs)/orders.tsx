import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ShoppingCart, ClipboardList, ChevronRight, Package } from "lucide-react-native";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  entregue: "Entregue",
  cancelado: "Cancelado",
  "em andamento": "Em andamento",
};

const STATUS_COLOR: Record<string, string> = {
  entregue: "#22c55e",
  cancelado: "#ef4444",
  "em andamento": "#f59e0b",
};

function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const date = new Date(order.date);
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Pressable
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm mb-4"
      onPress={() => router.push(`/restaurant/${order.restaurantId}`)}
    >
      <View className="flex-row">
        <Image
          source={{ uri: order.restaurantImage }}
          style={{ width: 88, height: 88 }}
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View className="flex-row items-start justify-between">
            <Text className="font-semibold text-foreground dark:text-white text-base flex-1 mr-2" numberOfLines={1}>
              {order.restaurantName}
            </Text>
            <View
              style={{ backgroundColor: STATUS_COLOR[order.status] + "20", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}
            >
              <Text style={{ color: STATUS_COLOR[order.status], fontSize: 11, fontWeight: "700" }}>
                {STATUS_LABEL[order.status]}
              </Text>
            </View>
          </View>

          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1" numberOfLines={2}>
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-gray-400">{formatted}</Text>
            <Text className="font-bold text-primary text-sm">
              R$ {order.total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex-row items-center justify-between">
        <Text className="text-xs text-gray-500">{order.id}</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-primary font-semibold">Ver restaurante</Text>
          <ChevronRight size={12} color="#ff4747" />
        </View>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();
  const { itemCount, total, restaurantName } = useCart();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <LinearGradient
        colors={["#ff4747", "#ff5252"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <View className="flex-row items-center gap-3">
          <ClipboardList size={28} color="#fff" />
          <Text className="text-white text-2xl font-bold">Meus Pedidos</Text>
        </View>
        <Text className="text-white/80 text-sm mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} no histórico
        </Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Cart banner */}
        {itemCount > 0 && (
          <Pressable
            onPress={() => router.push("/cart")}
            className="bg-primary rounded-2xl p-4 mb-6 flex-row items-center justify-between shadow-md"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <ShoppingCart size={20} color="#fff" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">
                  {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
                </Text>
                <Text className="text-white/80 text-xs">{restaurantName}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-white font-bold">
                R$ {total.toFixed(2).replace(".", ",")}
              </Text>
              <Text className="text-white/80 text-xs">Ver carrinho →</Text>
            </View>
          </Pressable>
        )}

        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-24">
            <Package size={64} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-400 mt-4">Nenhum pedido ainda</Text>
            <Text className="text-sm text-gray-400 mt-1 text-center px-8">
              Explore os restaurantes e faça seu primeiro pedido!
            </Text>
            <Pressable
              onPress={() => router.push("/")}
              className="mt-6 bg-primary px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Explorar restaurantes</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text className="text-base font-semibold text-foreground dark:text-white mb-3">
              Histórico
            </Text>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
