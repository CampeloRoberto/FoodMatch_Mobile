import { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CategoryPill } from "@/components/CategoryPill";
import { FilterModal } from "@/components/FilterModal";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { featuredRestaurant, popularRestaurants, allRestaurants, cuisineIcons } from "@/data/restaurants";
import type { Restaurant } from "@/types";
import { useColors } from "@/hooks/useColors";

const allCombined = [...popularRestaurants, ...allRestaurants];

export default function HomeScreen() {
  const { selectedTypes, selectedRestrictions } = useUserPreferences();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const colors = useColors();
  const styles = makeStyles(colors);
  const filterBadge = selectedTypes.length + selectedRestrictions.length;

  const isFiltered = selectedTypes.length > 0 || !!searchQuery.trim() || !!activeCategory;

  const applyFilters = (list: Restaurant[]) => {
    let result = list;
    if (selectedTypes.length > 0) {
      result = result.filter((r) => selectedTypes.includes(r.category));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    if (activeCategory) {
      result = result.filter((r) => r.category.toLowerCase() === activeCategory.toLowerCase());
    }
    return result;
  };

  const filteredGrid = applyFilters(isFiltered ? allCombined : allRestaurants);
  const noResults = isFiltered && filteredGrid.length === 0;

  const ListHeader = (
    <>
      <LinearGradient colors={["#ff4757", "#ff5252"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGradient}>
        <View style={styles.logoRow}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logoImage} />
          <Text style={styles.logoText}>FoodMatch</Text>
        </View>
        <Text style={styles.greeting}>Olá, Roberto!</Text>
        <View style={styles.searchWrapper}>
          <Search size={20} color="#9ca3af" style={styles.searchIconLeft} />
          <TextInput
            placeholder="Buscar restaurantes ou cozinhas..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchIconRight} onPress={() => setFilterVisible(true)}>
            <SlidersHorizontal size={20} color="#ff4757" />
            {filterBadge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{filterBadge}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={selectedTypes}
          keyExtractor={(item) => item}
          style={styles.pillsList}
          contentContainerStyle={styles.pillsContent}
          renderItem={({ item: type }) => (
            <CategoryPill
              icon={cuisineIcons[type] ?? "🍽️"}
              label={type}
              isActive={activeCategory === type}
              onPress={() => setActiveCategory(activeCategory === type ? null : type)}
            />
          )}
          ListEmptyComponent={null}
        />

        {noResults ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsTitle}>Nenhum restaurante encontrado</Text>
            <Text style={styles.noResultsSub}>Tente buscar por outra categoria ou termo</Text>
          </View>
        ) : null}

        {!isFiltered && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recomendado para Você</Text>
            </View>
            <RestaurantCard restaurant={featuredRestaurant} featured />
          </View>
        )}

        {!isFiltered && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Restaurantes Populares</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularRestaurants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <RestaurantCard restaurant={item} />}
            />
          </View>
        )}

        {filteredGrid.length > 0 && (
          <Text style={styles.allTitle}>
            {isFiltered ? "Resultados" : "Todos os Restaurantes"}
          </Text>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />
      <FlatList
        data={filteredGrid}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={filteredGrid.length > 0 ? styles.columnWrapper : undefined}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => <View style={styles.allCardWrapper}><RestaurantCard restaurant={item} featured /></View>}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    headerGradient: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    logoRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 },
    logoImage: { width: 40, height: 40, borderRadius: 20 },
    logoText: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
    greeting: { color: "#ffffff", fontSize: 20, fontWeight: "500", marginBottom: 16 },
    searchWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderRadius: 999, paddingHorizontal: 16, elevation: 4 },
    searchIconLeft: { marginRight: 8 },
    searchInput: { flex: 1, paddingVertical: 12, color: "#1f2937", fontSize: 15 },
    searchIconRight: { marginLeft: 8, position: "relative" },
    badge: { position: "absolute", top: -6, right: -6, backgroundColor: "#ff4757", borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
    badgeText: { color: "#ffffff", fontSize: 10, fontWeight: "700" },
    body: { paddingHorizontal: 24, paddingTop: 16 },
    pillsList: { marginBottom: 24, marginHorizontal: -8 },
    pillsContent: { paddingHorizontal: 8, paddingBottom: 8 },
    noPrefsBox: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, backgroundColor: colors.surface, borderRadius: 16 },
    noPrefsText: { fontSize: 13, color: colors.textMuted, textAlign: "center" },
    noResults: { alignItems: "center", paddingVertical: 48 },
    noResultsTitle: { fontSize: 17, color: colors.textMuted },
    noResultsSub: { fontSize: 13, color: colors.textLight, marginTop: 8 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: "600", color: colors.text },
    sectionAction: { flexDirection: "row", alignItems: "center", gap: 4 },
    sectionActionText: { fontSize: 13, color: "#ff4757" },
    allTitle: { fontSize: 20, fontWeight: "600", color: colors.text, marginBottom: 16 },
    listContent: { paddingBottom: 24 },
    columnWrapper: { paddingHorizontal: 24, gap: 16, marginBottom: 16 },
    allCardWrapper: { flex: 1 },
  });
}
