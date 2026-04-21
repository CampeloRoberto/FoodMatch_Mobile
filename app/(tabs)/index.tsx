import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CategoryPill } from "@/components/CategoryPill";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import {
  featuredRestaurant,
  popularRestaurants,
  allRestaurants,
  cuisineIcons,
} from "@/data/restaurants";
import type { Restaurant } from "@/types";

export default function HomeScreen() {
  const { selectedTypes } = useUserPreferences();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const getFiltered = (list: Restaurant[]) => {
    let result = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      result = result.filter(
        (r) => r.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return result;
  };

  const filteredPopular = getFiltered(popularRestaurants);
  const filteredAll = getFiltered(allRestaurants);
  const noResults =
    (searchQuery || activeCategory) &&
    filteredPopular.length === 0 &&
    filteredAll.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#ff4757", "#ff5252"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <View className="flex-row items-center justify-center gap-2 mb-5">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <Text className="text-white text-3xl font-bold">FoodMatch</Text>
          </View>

          <Text className="text-white text-xl mb-4 font-medium">Olá, Roberto!</Text>

          {/* Search Bar */}
          <View className="relative">
            <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
              <Search size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Buscar restaurantes ou cozinhas..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="w-full pl-12 pr-12 py-3 rounded-full bg-white text-foreground text-base"
              style={{ shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}
            />
            <Pressable className="absolute right-4 top-0 bottom-0 justify-center">
              <SlidersHorizontal size={20} color="#ff4757" />
            </Pressable>
          </View>
        </LinearGradient>

        <View className="px-6 pt-4">
          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 -mx-2"
            contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
          >
            {selectedTypes.length > 0 ? (
              selectedTypes.map((type) => (
                <CategoryPill
                  key={type}
                  icon={cuisineIcons[type] ?? "🍽️"}
                  label={type}
                  isActive={activeCategory === type}
                  onPress={() =>
                    setActiveCategory(activeCategory === type ? null : type)
                  }
                />
              ))
            ) : (
              <View className="flex-1 py-4 bg-secondary/30 rounded-2xl px-4">
                <Text className="text-sm text-muted-foreground text-center">
                  Nenhuma preferência selecionada. Configure no Perfil.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* No Results */}
          {noResults && (
            <View className="items-center py-12">
              <Text className="text-lg text-gray-500">
                Nenhum restaurante encontrado
              </Text>
              <Text className="text-sm text-gray-400 mt-2">
                Tente buscar por outra categoria ou termo
              </Text>
            </View>
          )}

          {/* Featured - only when no filters */}
          {!searchQuery && !activeCategory && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-primary">
                  Recomendado para Você
                </Text>
                <Pressable onPress={() => router.push("/all-restaurants" as any)} className="flex-row items-center gap-1">
                  <Text className="text-sm text-primary">Ver Mais</Text>
                  <ChevronRight size={16} color="#ff4757" />
                </Pressable>
              </View>
              <RestaurantCard restaurant={featuredRestaurant} featured />
            </View>
          )}

          {/* Popular */}
          {filteredPopular.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-semibold text-foreground dark:text-white">
                  {searchQuery || activeCategory
                    ? "Resultados Populares"
                    : "Restaurantes Populares"}
                </Text>
                <Pressable onPress={() => router.push("/all-restaurants" as any)} className="flex-row items-center gap-1">
                  <Text className="text-sm text-primary">Todos</Text>
                  <ChevronRight size={16} color="#ff4757" />
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {filteredPopular.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* All Restaurants */}
          {filteredAll.length > 0 && (
            <View className="mb-8">
              <Text className="text-xl font-semibold text-foreground dark:text-white mb-4">
                {searchQuery || activeCategory
                  ? "Mais Resultados"
                  : "Todos os Restaurantes"}
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {filteredAll.map((r) => (
                  <View key={r.id} style={{ width: "47%" }}>
                    <RestaurantCard restaurant={r} featured />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
