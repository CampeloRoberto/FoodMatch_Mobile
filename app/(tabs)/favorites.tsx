import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

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
          style={{
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 32,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Heart size={24} color="white" fill="white" />
            </View>
            <View>
              <Text className="text-white text-3xl font-bold">Favoritos</Text>
              <Text className="text-white/80 text-sm">
                {favorites.length}{" "}
                {favorites.length === 1 ? "restaurante salvo" : "restaurantes salvos"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="px-6 py-6">
          {favorites.length > 0 ? (
            <>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Toque no coração para remover dos favoritos
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {favorites.map((r) => (
                  <View key={r.id} style={{ width: "47%" }}>
                    <RestaurantCard restaurant={r} featured />
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View className="items-center justify-center py-20">
              <View className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center mb-6">
                <Heart size={48} color="#ff4757" />
              </View>
              <Text className="text-2xl font-semibold text-center text-foreground dark:text-white mb-3">
                Nenhum favorito ainda
              </Text>
              <Text className="text-muted-foreground dark:text-gray-400 text-center max-w-xs">
                Toque no ícone de coração em qualquer restaurante para salvá-lo aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
