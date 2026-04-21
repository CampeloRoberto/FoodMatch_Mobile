import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react-native";
import { findRestaurantById, getRestaurantDetail } from "@/data/restaurants";
import { getMenuByRestaurant, getMenuCategories } from "@/data/menus";
import { getReviewsByRestaurant } from "@/data/reviews";
import { useCart } from "@/context/CartContext";
import type { MenuItem, MenuCategory } from "@/types";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, itemCount, total } = useCart();

  const restaurantId = Number(id);
  const restaurant = findRestaurantById(restaurantId);
  const detail = getRestaurantDetail(restaurantId);
  const menuItems = getMenuByRestaurant(restaurantId);
  const categories = getMenuCategories(restaurantId);
  const reviews = getReviewsByRestaurant(restaurantId);

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    categories[0] ?? "Pratos Principais"
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "reviews">("menu");

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500">Restaurante não encontrado</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary font-semibold">Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const getItemQuantity = (menuItemId: number) =>
    items.find((i) => i.menuItem.id === menuItemId)?.quantity ?? 0;

  const filteredItems = menuItems.filter((m) => m.category === activeCategory);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Hero image */}
      <View style={{ height: 260, position: "relative" }}>
        <Image
          source={{ uri: restaurant.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {/* Overlay gradient */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: "transparent",
          }}
        />
        {/* Back button */}
        <SafeAreaView style={{ position: "absolute", top: 0, left: 0, right: 0 }} edges={["top"]}>
          <View className="flex-row items-center justify-between px-4 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow"
            >
              <ArrowLeft size={20} color="#1f2937" />
            </Pressable>
            <Pressable
              onPress={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow"
            >
              <Heart
                size={20}
                color={isFavorite ? "#ff4747" : "#9ca3af"}
                fill={isFavorite ? "#ff4747" : "none"}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: itemCount > 0 ? 100 : 24 }}
      >
        {/* Restaurant header */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-2xl font-bold text-foreground dark:text-white">
                {restaurant.name}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {restaurant.category} • {restaurant.priceRange}
              </Text>
            </View>
            <View className="items-center bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-xl">
              <View className="flex-row items-center gap-1">
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text className="font-bold text-amber-600 dark:text-amber-400 text-base">
                  {restaurant.rating}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-0.5">
                {reviews.length} avaliações
              </Text>
            </View>
          </View>

          {detail?.description && (
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-5">
              {detail.description}
            </Text>
          )}

          {/* Info pills */}
          {detail && (
            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-2">
                <MapPin size={14} color="#ff4747" />
                <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>
                  {detail.address}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Phone size={14} color="#ff4747" />
                <Text className="text-sm text-gray-600 dark:text-gray-300">{detail.phone}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={14} color="#ff4747" />
                <Text className="text-sm text-gray-600 dark:text-gray-300">{detail.hours}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Divider */}
        <View className="h-2 bg-gray-100 dark:bg-gray-800" />

        {/* Tab switcher */}
        <View className="flex-row px-5 pt-4 gap-4">
          <Pressable
            onPress={() => setActiveTab("menu")}
            className={`pb-2 border-b-2 ${activeTab === "menu" ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-semibold text-base ${
                activeTab === "menu" ? "text-primary" : "text-gray-400"
              }`}
            >
              Cardápio
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("reviews")}
            className={`pb-2 border-b-2 ${activeTab === "reviews" ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-semibold text-base ${
                activeTab === "reviews" ? "text-primary" : "text-gray-400"
              }`}
            >
              Avaliações ({reviews.length})
            </Text>
          </Pressable>
        </View>

        {activeTab === "menu" ? (
          <>
            {/* Category pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-5 pt-3 pb-1"
              contentContainerStyle={{ gap: 8 }}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: activeCategory === cat ? "#ff4747" : "#f3f4f6",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: activeCategory === cat ? "#fff" : "#6b7280",
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Menu items */}
            <View className="px-5 pt-3 gap-3">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={() => addItem(item, restaurant.id, restaurant.name)}
                  onRemove={() => {
                    const qty = getItemQuantity(item.id);
                    if (qty <= 1) removeItem(item.id);
                    else updateQuantity(item.id, qty - 1);
                  }}
                />
              ))}
            </View>
          </>
        ) : (
          <View className="px-5 pt-3 gap-3">
            {reviews.length === 0 ? (
              <View className="py-12 items-center">
                <Text className="text-gray-400">Nenhuma avaliação ainda</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <View
                  key={review.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center">
                        <Text className="text-primary font-bold text-sm">
                          {review.userName[0]}
                        </Text>
                      </View>
                      <Text className="font-semibold text-foreground dark:text-white">
                        {review.userName}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          color="#FFB800"
                          fill={i < review.rating ? "#FFB800" : "none"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5">
                    {review.comment}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-2">
                    {new Date(review.date).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating cart button */}
      {itemCount > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingBottom: 24,
            paddingTop: 12,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          }}
        >
          <Pressable
            onPress={() => router.push("/cart")}
            style={{
              backgroundColor: "#ff4747",
              borderRadius: 16,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.25)",
                borderRadius: 8,
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                {itemCount}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <ShoppingCart size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Ver carrinho
              </Text>
            </View>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm flex-row">
      <Image
        source={{ uri: item.image }}
        style={{ width: 88, height: 88 }}
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="font-semibold text-foreground dark:text-white text-sm" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-4" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-primary font-bold text-sm">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </Text>
          {quantity === 0 ? (
            <Pressable
              onPress={onAdd}
              style={{
                backgroundColor: "#ff4747",
                borderRadius: 8,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={18} color="#fff" />
            </Pressable>
          ) : (
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={onRemove}
                style={{
                  borderWidth: 1.5,
                  borderColor: "#ff4747",
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Minus size={14} color="#ff4747" />
              </Pressable>
              <Text className="text-foreground dark:text-white font-bold text-sm w-5 text-center">
                {quantity}
              </Text>
              <Pressable
                onPress={onAdd}
                style={{
                  backgroundColor: "#ff4747",
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
