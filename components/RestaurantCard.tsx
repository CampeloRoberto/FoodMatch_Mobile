import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Star, Heart } from "lucide-react-native";
import { useFavorites } from "@/context/FavoritesContext";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

export function RestaurantCard({ restaurant, featured = false }: RestaurantCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);

  const goToDetails = () => router.push(`/restaurant/${restaurant.id}` as any);

  if (featured) {
    return (
      <Pressable
        onPress={goToDetails}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg mb-2"
      >
        {/* Image area */}
        <View className="relative h-48">
          <Image
            source={{ uri: restaurant.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Heart button — stops propagation so it doesn't also navigate */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              toggleFavorite(restaurant.id);
            }}
            hitSlop={8}
            className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-700 rounded-full items-center justify-center shadow-md"
          >
            <Heart
              size={20}
              color={favorited ? "#ff4747" : "#9ca3af"}
              fill={favorited ? "#ff4747" : "none"}
            />
          </Pressable>
        </View>

        {/* Info */}
        <View className="p-4">
          <Text className="text-xl font-semibold mb-2 text-foreground dark:text-white">
            {restaurant.name}
          </Text>
          <View className="flex-row items-center gap-2 mb-4">
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text className="font-semibold text-foreground dark:text-white text-sm">
              {restaurant.rating}
            </Text>
            <Text className="text-muted-foreground dark:text-gray-400 text-sm">•</Text>
            <Text className="text-muted-foreground dark:text-gray-400 text-sm">
              {restaurant.distance}
            </Text>
            <Text className="text-muted-foreground dark:text-gray-400 text-sm">•</Text>
            <Text className="text-muted-foreground dark:text-gray-400 text-sm">
              {restaurant.category} {restaurant.priceRange}
            </Text>
          </View>
          <View className="bg-primary py-3 rounded-xl items-center">
            <Text className="text-white font-bold tracking-wider text-sm">VER DETALHES</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Compact card (horizontal scroll)
  return (
    <Pressable
      onPress={goToDetails}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md w-40 mr-3"
    >
      <View className="h-32">
        <Image
          source={{ uri: restaurant.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View className="p-3">
        <Text
          className="font-semibold mb-1 text-foreground dark:text-white text-sm"
          numberOfLines={1}
        >
          {restaurant.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <Star size={12} color="#FFB800" fill="#FFB800" />
          <Text className="font-semibold text-foreground dark:text-white text-xs">
            {restaurant.rating}
          </Text>
          <Text className="text-muted-foreground dark:text-gray-400 text-xs">•</Text>
          <Text
            className="text-muted-foreground dark:text-gray-400 text-xs"
            numberOfLines={1}
          >
            {restaurant.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
