import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ClipboardList, Package, RefreshCw } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, getToken } from "@/services/api";
import { useColors } from "@/hooks/useColors";
import type { PartnerOrder, OrderStatus } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  entregue:       "Entregue",
  cancelado:      "Cancelado",
  "em andamento": "Em andamento",
};

const STATUS_COLOR: Record<string, string> = {
  entregue:       "#22c55e",
  cancelado:      "#ef4444",
  "em andamento": "#f59e0b",
};

function OrderCard({
  order,
  onStatusChange,
  colors,
}: {
  order: PartnerOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const styles = makeStyles(colors);
  const date = new Date(order.date);
  const formatted = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={[styles.customerName, { color: colors.text }]}>{order.customerName}</Text>
          <Text style={[styles.customerEmail, { color: colors.textMuted }]}>{order.customerEmail}</Text>
          <Text style={[styles.cardDate, { color: colors.textLight }]}>{formatted}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[order.status] + "20" }]}>
          <Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
            {STATUS_LABEL[order.status]}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.itemsList}>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={[styles.itemQty, { color: colors.textMuted }]}>{item.quantity}x</Text>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.itemPrice, { color: colors.textMuted }]}>
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.cardBottom}>
        <View>
          <Text style={[styles.addressLabel, { color: colors.textLight }]}>Endereço</Text>
          <Text style={[styles.addressText, { color: colors.textMuted }]} numberOfLines={1}>{order.address}</Text>
        </View>
        <Text style={styles.totalText}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
      </View>

      {order.status === "em andamento" && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deliverBtn]}
            onPress={() => onStatusChange(order.id, "entregue")}
          >
            <Text style={styles.deliverBtnText}>Marcar como entregue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => onStatusChange(order.id, "cancelado")}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function PartnerOrdersScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [orders, setOrders]   = useState<PartnerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiFetch<PartnerOrder[]>(`/restaurants/${user.restaurantId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const label = status === "entregue" ? "marcar como entregue" : "cancelar";
    Alert.alert(
      "Confirmar",
      `Deseja ${label} este pedido?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const token = await getToken();
              await apiFetch(`/orders/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
                headers: { Authorization: `Bearer ${token}` },
              });
              setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status } : o))
              );
            } catch {
              Alert.alert("Erro", "Não foi possível atualizar o pedido.");
            }
          },
        },
      ]
    );
  };

  const pending   = orders.filter((o) => o.status === "em andamento");
  const concluded = orders.filter((o) => o.status !== "em andamento");

  const ListHeader = (
    <LinearGradient colors={["#ff4747", "#ff5252"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
      <View style={styles.headerRow}>
        <ClipboardList size={28} color="#fff" />
        <Text style={styles.headerTitle}>Pedidos Recebidos</Text>
        <TouchableOpacity onPress={load} style={styles.refreshBtn}>
          <RefreshCw size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerSubtitle}>
        {pending.length} em andamento · {concluded.length} concluído{concluded.length !== 1 ? "s" : ""}
      </Text>
    </LinearGradient>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
        {ListHeader}
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ff4757" />
        </View>
      </SafeAreaView>
    );
  }

  const sections: { title: string; data: PartnerOrder[] }[] = [];
  if (pending.length > 0)   sections.push({ title: "Em andamento", data: pending });
  if (concluded.length > 0) sections.push({ title: "Histórico",    data: concluded });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
      <FlatList
        data={sections}
        keyExtractor={(s) => s.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            {section.data.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} colors={colors} />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Package size={56} color="#d1d5db" />
            <Text style={[styles.emptyTitle, { color: colors.textMuted }]}>Nenhum pedido ainda</Text>
            <Text style={[styles.emptySub, { color: colors.textLight }]}>Os pedidos dos clientes aparecerão aqui</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container:     { flex: 1 },
    loadingBox:    { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent:   { paddingBottom: 24 },
    header:        { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 16 },
    headerRow:     { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle:   { color: "#fff", fontSize: 22, fontWeight: "700", flex: 1 },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    refreshBtn:    { padding: 4 },
    section:       { paddingHorizontal: 16, marginBottom: 8 },
    sectionTitle:  { fontSize: 16, fontWeight: "700", marginBottom: 10 },
    card:          { borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2 },
    cardTop:       { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 },
    cardLeft:      { flex: 1, marginRight: 8 },
    customerName:  { fontWeight: "700", fontSize: 15 },
    customerEmail: { fontSize: 12, marginTop: 2 },
    cardDate:      { fontSize: 11, marginTop: 4 },
    statusBadge:   { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    statusText:    { fontSize: 12, fontWeight: "700" },
    divider:       { height: 1, marginVertical: 10 },
    itemsList:     { gap: 4 },
    itemRow:       { flexDirection: "row", alignItems: "center", gap: 6 },
    itemQty:       { fontSize: 12, width: 26 },
    itemName:      { flex: 1, fontSize: 13 },
    itemPrice:     { fontSize: 13 },
    cardBottom:    { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
    addressLabel:  { fontSize: 11 },
    addressText:   { fontSize: 12, marginTop: 2 },
    totalText:     { color: "#ff4757", fontWeight: "700", fontSize: 16 },
    actionsRow:    { flexDirection: "row", gap: 10, marginTop: 12 },
    actionBtn:     { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
    deliverBtn:    { backgroundColor: "#22c55e" },
    deliverBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    cancelBtn:     { backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "#ef4444" },
    cancelBtnText: { color: "#ef4444", fontWeight: "700", fontSize: 13 },
    emptyBox:      { alignItems: "center", paddingTop: 64, paddingHorizontal: 32 },
    emptyTitle:    { fontSize: 18, fontWeight: "600", marginTop: 16 },
    emptySub:      { fontSize: 13, marginTop: 6, textAlign: "center" },
  });
}
