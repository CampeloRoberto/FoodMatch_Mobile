import { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { allRestaurants, popularRestaurants, featuredRestaurant } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";
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
  const colors = useColors();
  const styles = makeStyles(colors);

  const filtered = query.trim()
    ? ALL.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))
    : ALL;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title ?? "Todos os Restaurantes"}</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textLight} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nome ou culinária..."
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum resultado para "{query}"</Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={styles.countText}>
            {filtered.length} {filtered.length === 1 ? "restaurante" : "restaurantes"}
          </Text>
        }
        renderItem={({ item }) => (
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
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: colors.text, flex: 1 },
    searchWrapper: { paddingHorizontal: 16, paddingVertical: 12 },
    searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: colors.inputBg, borderRadius: 16, paddingHorizontal: 16, gap: 12 },
    searchInput: { flex: 1, paddingVertical: 12, color: colors.text, fontSize: 14 },
    clearBtn: { color: colors.textLight, fontSize: 18 },
    listContent: { paddingHorizontal: 16, paddingBottom: 24 },
    columnWrapper: { gap: 16, marginBottom: 16 },
    cardWrapper: { flex: 1 },
    countText: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
    emptyContainer: { alignItems: "center", paddingVertical: 64 },
    emptyText: { color: colors.textMuted, fontSize: 15 },
  });
}
