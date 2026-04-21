import { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { allRestaurants, popularRestaurants, featuredRestaurant } from "@/data/restaurants";
import type { Restaurant } from "@/types";

const ALL: Restaurant[] = [
  featuredRestaurant,
  ...popularRestaurants,
  ...allRestaurants,
].filter((r, idx, self) => self.findIndex((x) => x.id === r.id) === idx);

export default function AllRestaurantsScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? ALL.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : ALL;

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
        <Text className="text-xl font-bold text-foreground dark:text-white flex-1">
          {title ?? "Todos os Restaurantes"}
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 gap-3">
          <Search size={18} color="#9ca3af" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nome ou culinária..."
            placeholderTextColor="#9ca3af"
            className="flex-1 py-3 text-foreground dark:text-white text-sm"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {filtered.length} {filtered.length === 1 ? "restaurante" : "restaurantes"}
        </Text>

        {filtered.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-gray-400 text-base">Nenhum resultado para "{query}"</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4">
            {filtered.map((r) => (
              <View key={r.id} style={{ width: "47%" }}>
                <RestaurantCard restaurant={r} featured />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
