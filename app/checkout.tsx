import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone } from "lucide-react-native";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { findRestaurantById } from "@/data/restaurants";

type PaymentMethod = "card" | "pix" | "cash";

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { key: "card", label: "Cartão de crédito/débito", icon: <CreditCard size={20} color="#6b7280" /> },
  { key: "pix", label: "Pix", icon: <Smartphone size={20} color="#6b7280" /> },
  { key: "cash", label: "Dinheiro", icon: <Banknote size={20} color="#6b7280" /> },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total, restaurantId, restaurantName, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [address, setAddress] = useState("Rua das Flores, 123 – Jardins");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);

  const restaurant = restaurantId ? findRestaurantById(restaurantId) : null;
  const deliveryFee = 6.99;
  const grandTotal = total + deliveryFee;

  const handleConfirm = () => {
    if (!address.trim()) {
      Alert.alert("Endereço inválido", "Por favor, informe o endereço de entrega.");
      return;
    }
    if (!restaurantId || !restaurant) return;

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const order = addOrder({
        restaurantId,
        restaurantName,
        restaurantImage: restaurant.image,
        items,
        total: grandTotal,
        address,
      });
      clearCart();
      setLoading(false);
      router.replace(`/order-confirmation?orderId=${order.id}`);
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center mr-3">
          <ArrowLeft size={22} color="#1f2937" />
        </Pressable>
        <Text className="text-xl font-bold text-foreground dark:text-white">Finalizar pedido</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Restaurante */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
          <Text className="text-xs text-gray-500 mb-1 uppercase font-semibold tracking-wider">Restaurante</Text>
          <Text className="font-bold text-foreground dark:text-white text-base">{restaurantName}</Text>
          <Text className="text-gray-500 text-sm mt-0.5">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </Text>
        </View>

        {/* Endereço */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <MapPin size={18} color="#ff4747" />
            <Text className="font-semibold text-foreground dark:text-white">Endereço de entrega</Text>
          </View>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Rua, número, bairro..."
            placeholderTextColor="#9ca3af"
            className="bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-foreground dark:text-white text-sm border border-gray-200 dark:border-gray-600"
            multiline
          />
        </View>

        {/* Pagamento */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-3">
            <CreditCard size={18} color="#ff4747" />
            <Text className="font-semibold text-foreground dark:text-white">Forma de pagamento</Text>
          </View>
          <View className="gap-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setPayment(opt.key)}
                className="flex-row items-center gap-3 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border"
                style={{ borderColor: payment === opt.key ? "#ff4747" : "#e5e7eb" }}
              >
                {opt.icon}
                <Text className="text-foreground dark:text-white text-sm flex-1">{opt.label}</Text>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: payment === opt.key ? "#ff4747" : "#d1d5db",
                    backgroundColor: payment === opt.key ? "#ff4747" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {payment === opt.key && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Resumo de valores */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 gap-2">
          <Text className="font-semibold text-foreground dark:text-white mb-1">Resumo do pedido</Text>
          {items.map(({ menuItem, quantity }) => (
            <View key={menuItem.id} className="flex-row justify-between">
              <Text className="text-gray-500 text-sm flex-1 mr-2" numberOfLines={1}>
                {quantity}x {menuItem.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                R$ {(menuItem.price * quantity).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          ))}
          <View className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-2 gap-1">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Taxa de entrega</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                R$ {deliveryFee.toFixed(2).replace(".", ",")}
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="font-bold text-foreground dark:text-white">Total</Text>
              <Text className="font-bold text-primary text-base">
                R$ {grandTotal.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View className="px-4 pb-8 pt-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Pressable
          onPress={handleConfirm}
          disabled={loading}
          className="bg-primary rounded-2xl py-4 items-center"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white font-bold text-base tracking-wide">
            {loading ? "Confirmando pedido..." : `Confirmar • R$ ${grandTotal.toFixed(2).replace(".", ",")}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
