import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react-native";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import type { CartItem } from "@/types";

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount, restaurantName } = useCart();
  const colors = useColors();
  const styles = makeStyles(colors);

  const deliveryFee = 6.99;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrinho</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ShoppingCart size={72} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySubtitle}>Adicione itens do cardápio de um restaurante para continuar.</Text>
          <TouchableOpacity onPress={() => router.push("/")} style={styles.exploreBtn}>
            <Text style={styles.exploreBtnText}>Explorar restaurantes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Carrinho</Text>
          {restaurantName ? <Text style={styles.headerSub}>{restaurantName}</Text> : null}
        </View>
        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Trash2 size={14} color="#ef4444" />
          <Text style={styles.clearBtnText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.menuItem.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: CartItem }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.menuItem.image }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemName} numberOfLines={1}>{item.menuItem.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.menuItem.id)}>
                  <Trash2 size={16} color={colors.textLight} />
                </TouchableOpacity>
              </View>
              <View style={styles.itemBottomRow}>
                <Text style={styles.itemPrice}>
                  R$ {(item.menuItem.price * item.quantity).toFixed(2).replace(".", ",")}
                </Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)} style={styles.qtyBtnOutline}>
                    <Minus size={12} color="#ff4747" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)} style={styles.qtyBtnFilled}>
                    <Plus size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</Text>
          <Text style={styles.summaryValue}>R$ {total.toFixed(2).replace(".", ",")}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxa de entrega</Text>
          <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2).replace(".", ",")}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotalValue}>R$ {grandTotal.toFixed(2).replace(".", ",")}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/checkout")} style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Finalizar pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
    headerCenter: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: colors.text },
    headerSub: { fontSize: 12, color: colors.textMuted },
    clearBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#fecaca", borderRadius: 999 },
    clearBtnText: { color: "#ef4444", fontSize: 12, fontWeight: "600" },
    listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
    cartItem: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 16, overflow: "hidden", elevation: 2, marginBottom: 12 },
    itemImage: { width: 80, height: 80 },
    itemInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
    itemTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
    itemName: { fontWeight: "600", color: colors.text, fontSize: 13, flex: 1, marginRight: 8 },
    itemBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    itemPrice: { color: "#ff4757", fontWeight: "700", fontSize: 13 },
    qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    qtyBtnOutline: { borderWidth: 1.5, borderColor: "#ff4747", borderRadius: 7, width: 26, height: 26, alignItems: "center", justifyContent: "center" },
    qtyBtnFilled: { backgroundColor: "#ff4747", borderRadius: 7, width: 26, height: 26, alignItems: "center", justifyContent: "center" },
    qtyText: { fontWeight: "700", color: colors.text, fontSize: 13, width: 20, textAlign: "center" },
    summary: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 8 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between" },
    summaryLabel: { color: colors.textMuted, fontSize: 13 },
    summaryValue: { color: colors.text, fontSize: 13, fontWeight: "600" },
    summaryDivider: { borderTopWidth: 1, borderTopColor: colors.border, marginVertical: 4 },
    summaryTotal: { fontWeight: "700", color: colors.text, fontSize: 15 },
    summaryTotalValue: { fontWeight: "700", color: "#ff4757", fontSize: 18 },
    checkoutBtn: { backgroundColor: "#ff4757", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 8 },
    checkoutBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 15, letterSpacing: 0.5 },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    emptyTitle: { fontSize: 20, fontWeight: "600", color: colors.textMuted, marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 8, textAlign: "center", lineHeight: 20 },
    exploreBtn: { marginTop: 24, backgroundColor: "#ff4757", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
    exploreBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 14 },
  });
}
