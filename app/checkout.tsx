import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone } from "lucide-react-native";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { findRestaurantById } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

type PaymentMethod = "card" | "pix" | "cash";

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { key: "card", label: "Cartão de crédito/débito", icon: <CreditCard size={20} color="#6b7280" /> },
  { key: "pix", label: "Pix", icon: <Smartphone size={20} color="#6b7280" /> },
  { key: "cash", label: "Dinheiro", icon: <Banknote size={20} color="#6b7280" /> },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total, restaurantId, restaurantName, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [address, setAddress] = useState("Rua das Flores, 123 – Jardins");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const colors = useColors();
  const styles = makeStyles(colors);

  const restaurant = restaurantId ? findRestaurantById(restaurantId) : null;
  const deliveryFee = 6.99;
  const grandTotal = total + deliveryFee;

  const handleConfirm = () => {
    if (!address.trim()) {
      Alert.alert("Endereço inválido", "Por favor, informe o endereço de entrega.");
      return;
    }
    if (!restaurantId || !restaurant) return;
    setLoading(true);
    setTimeout(() => {
      const order = addOrder({ restaurantId, restaurantName, restaurantImage: restaurant.image, items, total: grandTotal, address });
      clearCart();
      setLoading(false);
      router.replace(`/order-confirmation?orderId=${order.id}`);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar pedido</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Restaurante</Text>
          <Text style={styles.cardTitle}>{restaurantName}</Text>
          <Text style={styles.cardSub}>{items.length} {items.length === 1 ? "item" : "itens"}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MapPin size={18} color="#ff4747" />
            <Text style={styles.cardSectionTitle}>Endereço de entrega</Text>
          </View>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Rua, número, bairro..."
            placeholderTextColor={colors.textLight}
            style={styles.addressInput}
            multiline
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <CreditCard size={18} color="#ff4747" />
            <Text style={styles.cardSectionTitle}>Forma de pagamento</Text>
          </View>
          <View style={styles.paymentOptions}>
            {PAYMENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setPayment(opt.key)}
                style={[styles.paymentOption, { borderColor: payment === opt.key ? "#ff4747" : colors.borderStrong }]}
              >
                {opt.icon}
                <Text style={styles.paymentLabel}>{opt.label}</Text>
                <View style={[styles.radio, { borderColor: payment === opt.key ? "#ff4747" : "#d1d5db", backgroundColor: payment === opt.key ? "#ff4747" : "transparent" }]}>
                  {payment === opt.key && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Resumo do pedido</Text>
          <View style={styles.summaryItems}>
            {items.map(({ menuItem, quantity }) => (
              <View key={menuItem.id} style={styles.summaryRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>{quantity}x {menuItem.name}</Text>
                <Text style={styles.summaryItemPrice}>R$ {(menuItem.price * quantity).toFixed(2).replace(".", ",")}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de entrega</Text>
            <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2).replace(".", ",")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotalValue}>R$ {grandTotal.toFixed(2).replace(".", ",")}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleConfirm} disabled={loading} style={[styles.confirmBtn, { opacity: loading ? 0.7 : 1 }]}>
          <Text style={styles.confirmBtnText}>
            {loading ? "Confirmando pedido..." : `Confirmar • R$ ${grandTotal.toFixed(2).replace(".", ",")}`}
          </Text>
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
    headerTitle: { fontSize: 20, fontWeight: "700", color: colors.text },
    scroll: { flex: 1, paddingHorizontal: 16 },
    scrollContent: { paddingTop: 16, paddingBottom: 24, gap: 16 },
    card: { backgroundColor: colors.cardAlt, borderRadius: 16, padding: 16 },
    cardLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    cardTitle: { fontWeight: "700", color: colors.text, fontSize: 15 },
    cardSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    cardSectionTitle: { fontWeight: "600", color: colors.text, fontSize: 15 },
    addressInput: { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: colors.text, fontSize: 13, borderWidth: 1, borderColor: colors.borderStrong },
    paymentOptions: { gap: 8 },
    paymentOption: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1.5 },
    paymentLabel: { color: colors.text, fontSize: 13, flex: 1 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ffffff" },
    summaryItems: { gap: 8, marginBottom: 12 },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    summaryItemName: { color: colors.textMuted, fontSize: 13, flex: 1, marginRight: 8 },
    summaryItemPrice: { color: colors.textMuted, fontSize: 13, fontWeight: "500" },
    summaryDivider: { borderTopWidth: 1, borderTopColor: colors.borderStrong, marginVertical: 8 },
    summaryLabel: { color: colors.textMuted, fontSize: 13 },
    summaryValue: { color: colors.textMuted, fontSize: 13 },
    summaryTotal: { fontWeight: "700", color: colors.text, fontSize: 15 },
    summaryTotalValue: { fontWeight: "700", color: "#ff4757", fontSize: 16 },
    footer: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg },
    confirmBtn: { backgroundColor: "#ff4757", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
    confirmBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 15, letterSpacing: 0.5 },
  });
}
