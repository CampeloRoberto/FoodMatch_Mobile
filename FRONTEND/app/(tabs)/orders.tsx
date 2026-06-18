import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ShoppingCart, ClipboardList, ChevronRight, Package } from "lucide-react-native";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import type { Order } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  entregue: "Entregue",
  cancelado: "Cancelado",
  "em andamento": "Em andamento",
};

const STATUS_COLOR: Record<string, string> = {
  entregue: "#22c55e",
  cancelado: "#ef4444",
  "em andamento": "#f59e0b",
};

function OrderCard({ order, colors }: { order: Order; colors: ReturnType<typeof import("@/hooks/useColors").useColors> }) {
  const router = useRouter();
  const styles = makeStyles(colors);
  const date = new Date(order.date);
  const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => router.push(`/restaurant/${order.restaurantId}`)}>
      <View style={styles.orderCardTop}>
        <Image source={{ uri: order.restaurantImage }} style={styles.orderImage} resizeMode="cover" />
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoTop}>
            <Text style={styles.orderRestaurantName} numberOfLines={1}>{order.restaurantName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[order.status] + "20" }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
                {STATUS_LABEL[order.status]}
              </Text>
            </View>
          </View>
          <Text style={styles.orderItems} numberOfLines={2}>
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </Text>
          <View style={styles.orderInfoBottom}>
            <Text style={styles.orderDate}>{formatted}</Text>
            <Text style={styles.orderTotal}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
          </View>
        </View>
      </View>
      <View style={styles.orderCardFooter}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={styles.footerAction}>
          <Text style={styles.footerActionText}>Ver restaurante</Text>
          <ChevronRight size={12} color="#ff4747" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();
  const { itemCount, total, restaurantName } = useCart();
  const colors = useColors();
  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <OrderCard order={item} colors={colors} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Package size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.emptySubtitle}>Explore os restaurantes e faça seu primeiro pedido!</Text>
            <TouchableOpacity onPress={() => router.push("/")} style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>Explorar restaurantes</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#ff4747", "#ff5252"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.header}
            >
              <View style={styles.headerRow}>
                <ClipboardList size={28} color="#fff" />
                <Text style={styles.headerTitle}>Meus Pedidos</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {orders.length} pedido{orders.length !== 1 ? "s" : ""} no histórico
              </Text>
            </LinearGradient>

            {itemCount > 0 && (
              <TouchableOpacity onPress={() => router.push("/cart")} style={styles.cartBanner}>
                <View style={styles.cartBannerLeft}>
                  <View style={styles.cartIconCircle}>
                    <ShoppingCart size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cartBannerTitle}>{itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho</Text>
                    <Text style={styles.cartBannerSub}>{restaurantName}</Text>
                  </View>
                </View>
                <View style={styles.cartBannerRight}>
                  <Text style={styles.cartBannerTotal}>R$ {total.toFixed(2).replace(".", ",")}</Text>
                  <Text style={styles.cartBannerLink}>Ver carrinho →</Text>
                </View>
              </TouchableOpacity>
            )}

            {orders.length > 0 && <Text style={styles.historyLabel}>Histórico</Text>}
          </>
        }
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgSecondary },
    listContent: { paddingBottom: 24 },
    header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 16 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle: { color: "#ffffff", fontSize: 22, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    cartBanner: { backgroundColor: "#ff4757", borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 4 },
    cartBannerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    cartIconCircle: { width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, alignItems: "center", justifyContent: "center" },
    cartBannerTitle: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
    cartBannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
    cartBannerRight: { alignItems: "flex-end" },
    cartBannerTotal: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
    cartBannerLink: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
    historyLabel: { fontSize: 15, fontWeight: "600", color: colors.text, marginHorizontal: 16, marginBottom: 12 },
    orderCard: { backgroundColor: colors.card, borderRadius: 16, overflow: "hidden", elevation: 2, marginHorizontal: 16, marginBottom: 16 },
    orderCardTop: { flexDirection: "row" },
    orderImage: { width: 88, height: 88 },
    orderInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
    orderInfoTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
    orderRestaurantName: { fontWeight: "600", color: colors.text, fontSize: 15, flex: 1, marginRight: 8 },
    statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
    statusText: { fontSize: 11, fontWeight: "700" },
    orderItems: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
    orderInfoBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
    orderDate: { fontSize: 12, color: colors.textLight },
    orderTotal: { fontWeight: "700", color: "#ff4757", fontSize: 13 },
    orderCardFooter: { borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    orderId: { fontSize: 12, color: colors.textMuted },
    footerAction: { flexDirection: "row", alignItems: "center", gap: 4 },
    footerActionText: { fontSize: 12, color: "#ff4757", fontWeight: "600" },
    emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 96, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 18, fontWeight: "600", color: colors.textMuted, marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: "center", lineHeight: 20 },
    exploreBtn: { marginTop: 24, backgroundColor: "#ff4757", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
    exploreBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  });
}
