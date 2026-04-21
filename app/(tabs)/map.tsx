import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Navigation } from "lucide-react-native";
import { nearbyRestaurants } from "@/data/restaurants";

export default function MapScreen() {
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
          style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <MapPin size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-3xl font-bold">Mapa</Text>
                <Text className="text-white/80 text-sm">
                  Restaurantes próximos
                </Text>
              </View>
            </View>
            <Pressable className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Navigation size={24} color="white" />
            </Pressable>
          </View>
        </LinearGradient>

        <View className="px-6 py-6 gap-6">
          {/* Map Placeholder */}
          <View className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg">
            <LinearGradient
              colors={["#ffe8e8", "#ffd0d0", "#ffe8e8"]}
              style={{ height: 300, alignItems: "center", justifyContent: "center" }}
            >
              <MapPin size={64} color="#ff4757" />
              <Text className="text-xl font-semibold text-primary mt-4 mb-2">
                Mapa Interativo
              </Text>
              <Text className="text-muted-foreground text-center px-8">
                Integração com mapa em breve! Veja a lista de restaurantes
                próximos abaixo.
              </Text>
            </LinearGradient>
          </View>

          {/* Nearby List */}
          <View className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Navigation size={20} color="#ff4757" />
              <Text className="text-xl font-semibold text-foreground dark:text-white">
                Restaurantes Próximos
              </Text>
            </View>
            <View className="gap-3">
              {nearbyRestaurants.map((restaurant, index) => (
                <View
                  key={restaurant.id}
                  className="flex-row items-center justify-between p-4 bg-secondary/50 rounded-xl"
                >
                  <View className="flex-row items-center gap-4">
                    <LinearGradient
                      colors={["#ff4757", "#ff5252"]}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text className="text-white font-semibold">
                        {index + 1}
                      </Text>
                    </LinearGradient>
                    <View>
                      <Text className="font-semibold text-foreground dark:text-white mb-1">
                        {restaurant.name}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <MapPin size={12} color="#9ca3af" />
                        <Text className="text-sm text-muted-foreground">
                          {restaurant.distance} de você
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable className="bg-primary px-4 py-2 rounded-full">
                    <Text className="text-white text-sm font-medium">
                      Ver Rota
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
