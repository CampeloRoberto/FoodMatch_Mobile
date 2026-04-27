import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Star, Heart } from "lucide-react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

export function RestaurantCard({ restaurant, featured = false }: RestaurantCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);
  const colors = useColors();
  const styles = makeStyles(colors);

  const goToDetails = () => router.push(`/restaurant/${restaurant.id}` as any);

  if (featured) {
    return (
      <TouchableOpacity onPress={goToDetails} style={styles.featuredCard}>
        <View style={styles.featuredImageWrapper}>
          <Image source={{ uri: restaurant.image }} style={styles.featuredImage} resizeMode="cover" />
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); toggleFavorite(restaurant.id); }}
            hitSlop={8}
            style={styles.heartBtn}
          >
            <Heart size={20} color={favorited ? "#ff4747" : "#9ca3af"} fill={favorited ? "#ff4747" : "none"} />
          </TouchableOpacity>
        </View>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName}>{restaurant.name}</Text>
          <View style={styles.metaRow}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.metaText}>{restaurant.rating}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{restaurant.distance}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{restaurant.category} {restaurant.priceRange}</Text>
          </View>
          <View style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>VER DETALHES</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={goToDetails} style={styles.compactCard}>
      <View style={styles.compactImageWrapper}>
        <Image source={{ uri: restaurant.image }} style={styles.compactImage} resizeMode="cover" />
      </View>
      <View style={styles.compactInfo}>
        <Text style={styles.compactName} numberOfLines={1}>{restaurant.name}</Text>
        <View style={styles.metaRow}>
          <Star size={12} color="#FFB800" fill="#FFB800" />
          <Text style={styles.compactMeta}>{restaurant.rating}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.compactMeta} numberOfLines={1}>{restaurant.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    featuredCard: { backgroundColor: colors.card, borderRadius: 16, overflow: "hidden", elevation: 4, marginBottom: 8 },
    featuredImageWrapper: { height: 192, position: "relative" },
    featuredImage: { width: "100%", height: "100%" },
    heartBtn: { position: "absolute", top: 12, right: 12, width: 40, height: 40, backgroundColor: colors.card, borderRadius: 20, alignItems: "center", justifyContent: "center", elevation: 4 },
    featuredInfo: { padding: 16 },
    featuredName: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: colors.text },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" },
    metaText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
    metaDot: { fontSize: 13, color: colors.textLight },
    detailsBtn: { backgroundColor: "#ff4757", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
    detailsBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 13, letterSpacing: 1 },
    compactCard: { backgroundColor: colors.card, borderRadius: 16, overflow: "hidden", elevation: 3, width: 160, marginRight: 12 },
    compactImageWrapper: { height: 128 },
    compactImage: { width: "100%", height: "100%" },
    compactInfo: { padding: 12 },
    compactName: { fontWeight: "600", marginBottom: 4, color: colors.text, fontSize: 13 },
    compactMeta: { fontSize: 11, color: colors.textMuted, fontWeight: "500" },
  });
}
