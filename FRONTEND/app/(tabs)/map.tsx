import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin, Navigation } from "lucide-react-native";
import { nearbyRestaurants } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

type NearbyRestaurant = (typeof nearbyRestaurants)[number];

export default function MapScreen() {
  const colors = useColors();
  const styles = makeStyles(colors);

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
                    <Text style={styles.headerSubtitle}>Restaurantes próximos</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.iconCircle}>
                  <Navigation size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.mapPlaceholderCard}>
              <LinearGradient
                colors={["#ffe8e8", "#ffd0d0", "#ffe8e8"]}
                style={styles.mapPlaceholder}
              >
                <MapPin size={64} color="#ff4757" />
                <Text style={styles.mapTitle}>Mapa Interativo</Text>
                <Text style={styles.mapSubtitle}>
                  Integração com mapa em breve! Veja a lista de restaurantes próximos abaixo.
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.listHeader}>
              <Navigation size={20} color="#ff4757" />
              <Text style={styles.listHeaderTitle}>Restaurantes Próximos</Text>
            </View>
          </>
        }
        renderItem={({ item, index }: { item: NearbyRestaurant; index: number }) => (
          <View style={styles.restaurantRow}>
            <View style={styles.restaurantLeft}>
              <LinearGradient colors={["#ff4757", "#ff5252"]} style={styles.indexBadge}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.distanceRow}>
                  <MapPin size={12} color="#9ca3af" />
                  <Text style={styles.distanceText}>{item.distance} de você</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.routeBtn}>
              <Text style={styles.routeBtnText}>Ver Rota</Text>
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
    listContent: { paddingBottom: 24 },
    header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    iconCircle: { width: 48, height: 48, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 24, alignItems: "center", justifyContent: "center" },
    headerTitle: { color: "#ffffff", fontSize: 28, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
    mapPlaceholderCard: { marginHorizontal: 24, marginTop: 24, borderRadius: 24, overflow: "hidden", elevation: 4 },
    mapPlaceholder: { height: 300, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    mapTitle: { fontSize: 18, fontWeight: "600", color: "#ff4757", marginTop: 16, marginBottom: 8 },
    mapSubtitle: { color: "#6b7280", textAlign: "center", fontSize: 13, lineHeight: 20 },
    listHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 24, marginTop: 24, marginBottom: 16 },
    listHeaderTitle: { fontSize: 18, fontWeight: "600", color: colors.text },
    restaurantRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 12, backgroundColor: colors.surface, marginHorizontal: 24, borderRadius: 12 },
    restaurantLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
    indexBadge: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
    indexText: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
    restaurantName: { fontWeight: "600", color: colors.text, fontSize: 14, marginBottom: 4 },
    distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    distanceText: { fontSize: 12, color: colors.textMuted },
    routeBtn: { backgroundColor: "#ff4757", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
    routeBtnText: { color: "#ffffff", fontSize: 13, fontWeight: "500" },
    separator: { height: 8 },
  });
}
