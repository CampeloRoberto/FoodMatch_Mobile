import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react-native";
import { findRestaurantById, getRestaurantDetail } from "@/data/restaurants";
import { getMenuByRestaurant, getMenuCategories } from "@/data/menus";
import { getReviewsByRestaurant } from "@/data/reviews";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import type { MenuItem, MenuCategory } from "@/types";

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const colors = useColors();
  const styles = makeStyles(colors);

  return (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} resizeMode="cover" />
      <View style={styles.menuItemInfo}>
        <View>
          <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
        </View>
        <View style={styles.menuItemBottom}>
          <Text style={styles.menuItemPrice}>R$ {item.price.toFixed(2).replace(".", ",")}</Text>
          {quantity === 0 ? (
            <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
              <Plus size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={onRemove} style={styles.qtyBtnOutline}>
                <Minus size={14} color="#ff4747" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={onAdd} style={styles.qtyBtnFilled}>
                <Plus size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function ReviewCard({ review }: { review: any }) {
  const colors = useColors();
  const styles = makeStyles(colors);

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <View style={styles.reviewUser}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>{review.userName[0]}</Text>
          </View>
          <Text style={styles.reviewUserName}>{review.userName}</Text>
        </View>
        <View style={styles.reviewStars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} color="#FFB800" fill={i < review.rating ? "#FFB800" : "none"} />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString("pt-BR")}</Text>
    </View>
  );
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, itemCount, total } = useCart();
  const colors = useColors();
  const styles = makeStyles(colors);

  const restaurantId = Number(id);
  const restaurant = findRestaurantById(restaurantId);
  const detail = getRestaurantDetail(restaurantId);
  const menuItems = getMenuByRestaurant(restaurantId);
  const categories = getMenuCategories(restaurantId);
  const reviews = getReviewsByRestaurant(restaurantId);

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(
    categories[0] ?? "Pratos Principais"
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "reviews">("menu");

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurante não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.notFoundBack}>
          <Text style={styles.notFoundBackText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getItemQuantity = (menuItemId: number) =>
    items.find((i) => i.menuItem.id === menuItemId)?.quantity ?? 0;

  const filteredItems = menuItems.filter((m) => m.category === activeCategory);

  const ListHeader = (
    <>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: restaurant.image }} style={styles.heroImage} resizeMode="cover" />
        <SafeAreaView style={styles.heroOverlay} edges={["top"]}>
          <View style={styles.heroButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.heroBtn}>
              <ArrowLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.heroBtn}>
              <Heart size={20} color={isFavorite ? "#ff4747" : "#9ca3af"} fill={isFavorite ? "#ff4747" : "none"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Restaurant info */}
      <View style={styles.infoSection}>
        <View style={styles.infoTopRow}>
          <View style={styles.infoTitleBlock}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantMeta}>{restaurant.category} • {restaurant.priceRange}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingValue}>{restaurant.rating}</Text>
            </View>
            <Text style={styles.ratingCount}>{reviews.length} avaliações</Text>
          </View>
        </View>

        {detail?.description && (
          <Text style={styles.description}>{detail.description}</Text>
        )}

        {detail && (
          <View style={styles.detailPills}>
            <View style={styles.detailRow}>
              <MapPin size={14} color="#ff4747" />
              <Text style={styles.detailText} numberOfLines={1}>{detail.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Phone size={14} color="#ff4747" />
              <Text style={styles.detailText}>{detail.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={14} color="#ff4747" />
              <Text style={styles.detailText}>{detail.hours}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab("menu")}
          style={[styles.tab, activeTab === "menu" && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === "menu" && styles.tabTextActive]}>Cardápio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("reviews")}
          style={[styles.tab, activeTab === "reviews" && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === "reviews" && styles.tabTextActive]}>
            Avaliações ({reviews.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category pills (menu tab) */}
      {activeTab === "menu" && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          style={styles.catList}
          contentContainerStyle={styles.catListContent}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(cat as MenuCategory)}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
            >
              <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {activeTab === "menu" ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: itemCount > 0 ? 100 : 24 }}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <View style={styles.menuItemWrapper}>
              <MenuItemCard
                item={item}
                quantity={getItemQuantity(item.id)}
                onAdd={() => addItem(item, restaurant.id, restaurant.name)}
                onRemove={() => {
                  const qty = getItemQuantity(item.id);
                  if (qty <= 1) removeItem(item.id);
                  else updateQuantity(item.id, qty - 1);
                }}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: itemCount > 0 ? 100 : 24 }}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyReviewsText}>Nenhuma avaliação ainda</Text>
            </View>
          }
          renderItem={({ item }) => <ReviewCard review={item} />}
        />
      )}

      {/* Floating cart button */}
      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <TouchableOpacity onPress={() => router.push("/cart")} style={styles.cartBtn}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{itemCount}</Text>
            </View>
            <View style={styles.cartBtnCenter}>
              <ShoppingCart size={18} color="#fff" />
              <Text style={styles.cartBtnLabel}>Ver carrinho</Text>
            </View>
            <Text style={styles.cartBtnTotal}>R$ {total.toFixed(2).replace(".", ",")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    notFoundContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
    notFoundText: { color: colors.textMuted, fontSize: 16 },
    notFoundBack: { marginTop: 16 },
    notFoundBackText: { color: "#ff4757", fontWeight: "600" },
    hero: { height: 260, position: "relative" },
    heroImage: { width: "100%", height: "100%" },
    heroOverlay: { position: "absolute", top: 0, left: 0, right: 0 },
    heroButtons: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8 },
    heroBtn: { width: 40, height: 40, backgroundColor: colors.surface, borderRadius: 20, alignItems: "center", justifyContent: "center", elevation: 3 },
    infoSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: colors.bg },
    infoTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
    infoTitleBlock: { flex: 1, marginRight: 12 },
    restaurantName: { fontSize: 22, fontWeight: "700", color: colors.text },
    restaurantMeta: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
    ratingBadge: { alignItems: "center", backgroundColor: "#fffbeb", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingValue: { fontWeight: "700", color: "#d97706", fontSize: 15 },
    ratingCount: { fontSize: 11, color: colors.textLight, marginTop: 2 },
    description: { color: colors.textMuted, fontSize: 13, marginTop: 12, lineHeight: 20 },
    detailPills: { marginTop: 16, gap: 8 },
    detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    detailText: { fontSize: 13, color: colors.textMuted, flex: 1 },
    divider: { height: 8, backgroundColor: colors.bgSecondary },
    tabs: { flexDirection: "row", paddingHorizontal: 20, paddingTop: 16, gap: 16, backgroundColor: colors.bg },
    tab: { paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: "transparent" },
    tabActive: { borderBottomColor: "#ff4757" },
    tabText: { fontWeight: "600", fontSize: 15, color: colors.textLight },
    tabTextActive: { color: "#ff4757" },
    catList: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
    catListContent: { gap: 8 },
    catPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.inputBg },
    catPillActive: { backgroundColor: "#ff4747" },
    catPillText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
    catPillTextActive: { color: "#ffffff" },
    menuItemWrapper: { paddingHorizontal: 20, paddingTop: 12 },
    menuItem: { backgroundColor: colors.card, borderRadius: 16, overflow: "hidden", elevation: 2, flexDirection: "row" },
    menuItemImage: { width: 88, height: 88 },
    menuItemInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
    menuItemName: { fontWeight: "600", color: colors.text, fontSize: 13 },
    menuItemDesc: { color: colors.textMuted, fontSize: 11, marginTop: 2, lineHeight: 16 },
    menuItemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
    menuItemPrice: { color: "#ff4757", fontWeight: "700", fontSize: 13 },
    addBtn: { backgroundColor: "#ff4747", borderRadius: 8, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
    qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    qtyBtnOutline: { borderWidth: 1.5, borderColor: "#ff4747", borderRadius: 8, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
    qtyBtnFilled: { backgroundColor: "#ff4747", borderRadius: 8, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
    qtyText: { fontWeight: "700", color: colors.text, fontSize: 13, width: 20, textAlign: "center" },
    cartBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    cartBtn: { backgroundColor: "#ff4747", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cartCountBadge: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 8, width: 28, height: 28, alignItems: "center", justifyContent: "center" },
    cartCountText: { color: "#ffffff", fontWeight: "800", fontSize: 13 },
    cartBtnCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
    cartBtnLabel: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
    cartBtnTotal: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
    reviewCard: { backgroundColor: colors.cardAlt, borderRadius: 16, padding: 16, marginHorizontal: 20, marginTop: 12 },
    reviewTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    reviewUser: { flexDirection: "row", alignItems: "center", gap: 8 },
    reviewAvatar: { width: 32, height: 32, backgroundColor: "rgba(255,71,87,0.15)", borderRadius: 16, alignItems: "center", justifyContent: "center" },
    reviewAvatarText: { color: "#ff4757", fontWeight: "700", fontSize: 13 },
    reviewUserName: { fontWeight: "600", color: colors.text, fontSize: 14 },
    reviewStars: { flexDirection: "row", gap: 2 },
    reviewComment: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
    reviewDate: { color: colors.textLight, fontSize: 11, marginTop: 8 },
    emptyReviews: { paddingVertical: 48, alignItems: "center" },
    emptyReviewsText: { color: colors.textLight, fontSize: 14 },
  });
}
