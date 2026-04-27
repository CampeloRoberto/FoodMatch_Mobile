import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import type { Restaurant } from "@/types";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const colors = useColors();
  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={favorites.length > 0 ? styles.columnWrapper : undefined}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Heart size={48} color="#ff4757" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptySubtitle}>
              Toque no ícone de coração em qualquer restaurante para salvá-lo aqui.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#ff4757", "#ff5252"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.header}
            >
              <View style={styles.headerRow}>
                <View style={styles.iconCircle}>
                  <Heart size={24} color="white" fill="white" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Favoritos</Text>
                  <Text style={styles.headerSubtitle}>
                    {favorites.length}{" "}
                    {favorites.length === 1 ? "restaurante salvo" : "restaurantes salvos"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            {favorites.length > 0 && <Text style={styles.hint}>Toque no coração para remover dos favoritos</Text>}
          </>
        }
        renderItem={({ item }: { item: Restaurant }) => (
          <View style={styles.cardWrapper}>
            <RestaurantCard restaurant={item} featured />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    listContent: { paddingBottom: 24 },
    columnWrapper: { paddingHorizontal: 24, gap: 16, marginBottom: 16 },
    header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 8 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
    iconCircle: { width: 48, height: 48, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 24, alignItems: "center", justifyContent: "center" },
    headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
    hint: { fontSize: 13, color: colors.textMuted, paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8 },
    cardWrapper: { flex: 1 },
    emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 80, paddingHorizontal: 32 },
    emptyIcon: { width: 96, height: 96, backgroundColor: "#fff1f2", borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 24 },
    emptyTitle: { fontSize: 22, fontWeight: "600", textAlign: "center", color: colors.text, marginBottom: 12 },
    emptySubtitle: { color: colors.textMuted, textAlign: "center", fontSize: 14, lineHeight: 20 },
  });
}
