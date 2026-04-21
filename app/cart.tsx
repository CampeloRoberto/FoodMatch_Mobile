import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react-native";
import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount, restaurantName } =
    useCart();

  const deliveryFee = 6.99;
  const grandTotal = total + deliveryFee;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <ArrowLeft size={22} color="#1f2937" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground dark:text-white">Carrinho</Text>
          {restaurantName ? (
            <Text className="text-xs text-gray-500">{restaurantName}</Text>
          ) : null}
        </View>
        {items.length > 0 && (
          <Pressable onPress={clearCart} className="flex-row items-center gap-1 px-3 py-1.5 border border-red-200 rounded-full">
            <Trash2 size={14} color="#ef4444" />
            <Text className="text-red-500 text-xs font-semibold">Limpar</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <ShoppingCart size={72} color="#d1d5db" />
          <Text className="text-xl font-semibold text-gray-400 mt-4">Carrinho vazio</Text>
          <Text className="text-sm text-gray-400 mt-2 text-center">
            Adicione itens do cardápio de um restaurante para continuar.
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
          <ScrollView
            className="flex-1 px-4 pt-3"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {items.map(({ menuItem, quantity }) => (
              <View
                key={menuItem.id}
                className="flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm mb-3"
              >
                <Image
                  source={{ uri: menuItem.image }}
                  style={{ width: 80, height: 80 }}
                  resizeMode="cover"
                />
                <View className="flex-1 p-3 justify-between">
                  <View className="flex-row items-start justify-between">
                    <Text
                      className="font-semibold text-foreground dark:text-white text-sm flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {menuItem.name}
                    </Text>
                    <Pressable onPress={() => removeItem(menuItem.id)}>
                      <Trash2 size={16} color="#9ca3af" />
                    </Pressable>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-primary font-bold text-sm">
                      R$ {(menuItem.price * quantity).toFixed(2).replace(".", ",")}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() => updateQuantity(menuItem.id, quantity - 1)}
                        style={{
                          borderWidth: 1.5,
                          borderColor: "#ff4747",
                          borderRadius: 7,
                          width: 26,
                          height: 26,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Minus size={12} color="#ff4747" />
                      </Pressable>
                      <Text className="font-bold text-foreground dark:text-white text-sm w-5 text-center">
                        {quantity}
                      </Text>
                      <Pressable
                        onPress={() => updateQuantity(menuItem.id, quantity + 1)}
                        style={{
                          backgroundColor: "#ff4747",
                          borderRadius: 7,
                          width: 26,
                          height: 26,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={12} color="#fff" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Order summary + checkout */}
          <View
            className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-4 pb-8"
          >
            <View className="gap-2 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
                </Text>
                <Text className="text-foreground dark:text-white text-sm font-semibold">
                  R$ {total.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Taxa de entrega</Text>
                <Text className="text-foreground dark:text-white text-sm font-semibold">
                  R$ {deliveryFee.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View className="border-t border-gray-100 dark:border-gray-700 pt-2 flex-row justify-between">
                <Text className="font-bold text-foreground dark:text-white">Total</Text>
                <Text className="font-bold text-primary text-lg">
                  R$ {grandTotal.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/checkout")}
              className="bg-primary rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base tracking-wide">
                Finalizar pedido
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
