import { useCallback, useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, ShoppingBag, CheckCircle, Clock, XCircle, RefreshCw, Award } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, getToken } from "@/services/api";
import { useColors } from "@/hooks/useColors";

interface RestaurantStats {
  totalRevenue: number;
  totalOrders: number;
  ordersDelivered: number;
  ordersPending: number;
  ordersCanceled: number;
  topItems: { name: string; quantity: number; revenue: number }[];
}

function StatCard({
  icon,
  label,
  value,
  color,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={[cardStyles.box, { backgroundColor: colors.card }]}>
      <View style={[cardStyles.iconWrap, { backgroundColor: color + "18" }]}>{icon}</View>
      <Text style={[cardStyles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[cardStyles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  box:      { flex: 1, borderRadius: 16, padding: 14, alignItems: "center", gap: 6, elevation: 2, minWidth: 0 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  value:    { fontSize: 20, fontWeight: "800" },
  label:    { fontSize: 11, fontWeight: "600", textAlign: "center" },
});

export default function PartnerBalanceScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [stats, setStats]     = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiFetch<RestaurantStats>(`/restaurants/${user.restaurantId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o balanço.");
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => { load(); }, [load]);

  const fmtBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
      <LinearGradient
        colors={["#ff4747", "#ff5252"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TrendingUp size={28} color="#fff" />
          <Text style={styles.headerTitle}>Balanço Geral</Text>
          <TouchableOpacity onPress={load} style={styles.refreshBtn}>
            <RefreshCw size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Receita acumulada via FoodMatch</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ff4757" />
        </View>
      ) : !stats ? null : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Receita total — destaque */}
          <View style={[styles.revenueCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.revenueLabel, { color: colors.textMuted }]}>Receita Total (pedidos entregues)</Text>
            <Text style={styles.revenueValue}>{fmtBRL(stats.totalRevenue)}</Text>
          </View>

          {/* Grade de métricas */}
          <View style={styles.grid}>
            <StatCard
              icon={<ShoppingBag size={20} color="#6366f1" />}
              label="Total de pedidos"
              value={String(stats.totalOrders)}
              color="#6366f1"
              colors={colors}
            />
            <StatCard
              icon={<CheckCircle size={20} color="#22c55e" />}
              label="Entregues"
              value={String(stats.ordersDelivered)}
              color="#22c55e"
              colors={colors}
            />
          </View>
          <View style={styles.grid}>
            <StatCard
              icon={<Clock size={20} color="#f59e0b" />}
              label="Em andamento"
              value={String(stats.ordersPending)}
              color="#f59e0b"
              colors={colors}
            />
            <StatCard
              icon={<XCircle size={20} color="#ef4444" />}
              label="Cancelados"
              value={String(stats.ordersCanceled)}
              color="#ef4444"
              colors={colors}
            />
          </View>

          {/* Taxa de entrega */}
          {stats.totalOrders > 0 && (
            <View style={[styles.rateCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.rateLabel, { color: colors.textMuted }]}>Taxa de entrega</Text>
              <View style={styles.rateBarBg}>
                <View
                  style={[
                    styles.rateBarFill,
                    { width: `${Math.round((stats.ordersDelivered / stats.totalOrders) * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.rateValue}>
                {Math.round((stats.ordersDelivered / stats.totalOrders) * 100)}% dos pedidos entregues
              </Text>
            </View>
          )}

          {/* Top pratos */}
          {stats.topItems.length > 0 && (
            <View style={[styles.topCard, { backgroundColor: colors.card }]}>
              <View style={styles.topHeader}>
                <Award size={20} color="#ff4757" />
                <Text style={[styles.topTitle, { color: colors.text }]}>Pratos mais pedidos</Text>
              </View>
              {stats.topItems.map((item, idx) => (
                <View key={item.name} style={[styles.topRow, idx < stats.topItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
                  <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? "#fef08a" : colors.inputBg }]}>
                    <Text style={[styles.rankText, { color: idx === 0 ? "#92400e" : colors.textMuted }]}>#{idx + 1}</Text>
                  </View>
                  <Text style={[styles.topItemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.topItemRight}>
                    <Text style={[styles.topItemQty, { color: colors.textMuted }]}>{item.quantity}x</Text>
                    <Text style={styles.topItemRevenue}>{fmtBRL(item.revenue)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container:    { flex: 1 },
    loadingBox:   { flex: 1, alignItems: "center", justifyContent: "center" },
    header:       { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerRow:    { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle:  { color: "#fff", fontSize: 22, fontWeight: "700", flex: 1 },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    refreshBtn:   { padding: 4 },
    scrollContent: { padding: 16, gap: 12, paddingBottom: 32 },
    revenueCard:  { borderRadius: 20, padding: 24, alignItems: "center", gap: 6, elevation: 2 },
    revenueLabel: { fontSize: 12, fontWeight: "600" },
    revenueValue: { fontSize: 36, fontWeight: "800", color: "#ff4757" },
    grid:         { flexDirection: "row", gap: 12 },
    rateCard:     { borderRadius: 16, padding: 16, gap: 10, elevation: 2 },
    rateLabel:    { fontSize: 12, fontWeight: "600" },
    rateBarBg:    { height: 10, backgroundColor: "#e5e7eb", borderRadius: 5, overflow: "hidden" },
    rateBarFill:  { height: 10, backgroundColor: "#22c55e", borderRadius: 5 },
    rateValue:    { fontSize: 13, fontWeight: "600", color: "#22c55e" },
    topCard:      { borderRadius: 16, padding: 16, elevation: 2 },
    topHeader:    { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    topTitle:     { fontSize: 16, fontWeight: "700" },
    topRow:       { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
    rankBadge:    { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    rankText:     { fontSize: 11, fontWeight: "700" },
    topItemName:  { flex: 1, fontSize: 14, fontWeight: "500" },
    topItemRight: { alignItems: "flex-end", gap: 2 },
    topItemQty:   { fontSize: 11 },
    topItemRevenue: { fontSize: 13, fontWeight: "700", color: "#ff4757" },
  });
}
