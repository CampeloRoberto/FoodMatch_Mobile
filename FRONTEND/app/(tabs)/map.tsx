import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Navigation, ChevronRight, X } from "lucide-react-native";
import { nearbyRestaurants } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";
import CidadeMap from "@/components/CidadeMap";

type NearbyRestaurant = (typeof nearbyRestaurants)[number];

export default function MapScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [routeToId, setRouteToId] = useState<number | null>(null);

  const selected = selectedId != null
    ? nearbyRestaurants.find((r) => r.id === selectedId) ?? null
    : null;

  const routeTarget = routeToId != null
    ? nearbyRestaurants.find((r) => r.id === routeToId) ?? null
    : null;

  function handleSelectRestaurant(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleVerRota(id: number) {
    setRouteToId((prev) => (prev === id ? null : id));
    setSelectedId(id);
  }

  function handleCancelRoute() {
    setRouteToId(null);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={nearbyRestaurants}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <>
            {/* Header */}
            <LinearGradient
              colors={["#ff4757", "#ff5252"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.header}
            >
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconCircle}>
                    <MapPin size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.headerTitle}>Mapa</Text>
                    <Text style={styles.headerSubtitle}>Cidadezinha · 5 restaurantes</Text>
                  </View>
                </View>
                <View style={styles.iconCircle}>
                  <Navigation size={24} color="white" />
                </View>
              </View>
            </LinearGradient>

            {/* Mapa */}
            <View style={styles.mapCard}>
              <CidadeMap
                restaurants={nearbyRestaurants}
                selectedId={selectedId}
                routeToId={routeToId}
                onSelectRestaurant={handleSelectRestaurant}
              />
            </View>

            {/* Dica de zoom */}
            <Text style={styles.mapHint}>Pinça para zoom · Duplo toque para resetar</Text>

            {/* Banner de rota ativa */}
            {routeTarget && (
              <View style={styles.routeBanner}>
                <View style={styles.routeBannerLeft}>
                  <View style={styles.routeDot} />
                  <Text style={styles.routeBannerText}>
                    Rota para <Text style={styles.routeBannerName}>{routeTarget.name}</Text>
                    {"  "}·{"  "}{routeTarget.distance}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCancelRoute} hitSlop={12}>
                  <X size={18} color="#4285f4" />
                </TouchableOpacity>
              </View>
            )}

            {/* Card do restaurante selecionado */}
            {selected && (
              <View style={styles.selectedCard}>
                <View style={styles.selectedLeft}>
                  <LinearGradient colors={["#ff4757", "#ff5252"]} style={styles.selectedBadge}>
                    <MapPin size={16} color="#fff" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.selectedName}>{selected.name}</Text>
                    <Text style={styles.selectedDist}>{selected.distance} de você</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.routeBtn, routeToId === selected.id && styles.routeBtnActive]}
                  onPress={() => handleVerRota(selected.id)}
                >
                  <Navigation size={14} color="#fff" />
                  <Text style={styles.routeBtnText}>
                    {routeToId === selected.id ? "Ocultar Rota" : "Ver Rota"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Título da lista */}
            <View style={styles.listHeader}>
              <Navigation size={20} color="#ff4757" />
              <Text style={styles.listHeaderTitle}>Restaurantes Próximos</Text>
            </View>
          </>
        }
        renderItem={({ item, index }: { item: NearbyRestaurant; index: number }) => (
          <View style={[styles.restaurantRow, selectedId === item.id && styles.restaurantRowSelected]}>
            <TouchableOpacity
              style={styles.restaurantLeft}
              onPress={() => handleSelectRestaurant(item.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={routeToId === item.id ? ["#1a56cc", "#4285f4"] : selectedId === item.id ? ["#cc2233", "#ff2233"] : ["#ff4757", "#ff5252"]}
                style={styles.indexBadge}
              >
                <Text style={styles.indexText}>{index + 1}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.distanceRow}>
                  <MapPin size={12} color="#9ca3af" />
                  <Text style={styles.distanceText}>{item.distance} de você</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.routeBtn, routeToId === item.id && styles.routeBtnActive]}
              onPress={() => handleVerRota(item.id)}
            >
              <Navigation size={13} color="#fff" />
              <Text style={styles.routeBtnText}>
                {routeToId === item.id ? "Ocultar" : "Ver Rota"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    listContent: { paddingBottom: 32 },
    header: {
      paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32,
      borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconCircle: {
      width: 48, height: 48, backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 24, alignItems: "center", justifyContent: "center",
    },
    headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
    mapCard: {
      marginHorizontal: 16, marginTop: 20,
      borderRadius: 20, overflow: "hidden",
      elevation: 5,
      shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    },
    mapHint: {
      textAlign: "center", fontSize: 11, color: colors.textMuted,
      marginTop: 6, marginBottom: 2,
    },
    routeBanner: {
      marginHorizontal: 16, marginTop: 10,
      backgroundColor: "#eef4ff",
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      borderWidth: 1, borderColor: "#c0d4f8",
    },
    routeBannerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
    routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4285f4" },
    routeBannerText: { fontSize: 13, color: "#3d5a99", flex: 1 },
    routeBannerName: { fontWeight: "700", color: "#1a56cc" },
    selectedCard: {
      marginHorizontal: 16, marginTop: 10,
      backgroundColor: colors.surface,
      borderRadius: 14, padding: 14,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      borderWidth: 1.5, borderColor: "#ff4757",
      elevation: 2,
    },
    selectedLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    selectedBadge: {
      width: 36, height: 36, borderRadius: 18,
      alignItems: "center", justifyContent: "center",
    },
    selectedName: { fontWeight: "700", color: colors.text, fontSize: 14 },
    selectedDist: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    listHeader: {
      flexDirection: "row", alignItems: "center", gap: 8,
      marginHorizontal: 24, marginTop: 20, marginBottom: 12,
    },
    listHeaderTitle: { fontSize: 18, fontWeight: "600", color: colors.text },
    restaurantRow: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: 16, paddingVertical: 12,
      backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 12,
    },
    restaurantRowSelected: { borderWidth: 1.5, borderColor: "#ff4757" },
    restaurantLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
    indexBadge: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: "center", justifyContent: "center",
    },
    indexText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
    restaurantName: { fontWeight: "600", color: colors.text, fontSize: 14, marginBottom: 3 },
    distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    distanceText: { fontSize: 12, color: colors.textMuted },
    routeBtn: {
      backgroundColor: "#ff4757",
      paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 5,
    },
    routeBtnActive: { backgroundColor: "#4285f4" },
    routeBtnText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
    separator: { height: 8 },
  });
}
