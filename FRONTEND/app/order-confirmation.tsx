import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, ClipboardList, Home } from "lucide-react-native";
import { useOrders } from "@/context/OrdersContext";
import { useColors } from "@/hooks/useColors";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);
  const colors = useColors();
  const styles = makeStyles(colors);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.checkCircle}>
          <CheckCircle size={56} color="#22c55e" fill="#22c55e" />
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        <Text style={styles.title}>Pedido confirmado!</Text>
        <Text style={styles.subtitle}>Seu pedido foi recebido e está sendo preparado com carinho.</Text>

        {order && (
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Pedido</Text>
              <Text style={styles.orderValue}>{order.id}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Restaurante</Text>
              <Text style={[styles.orderValue, styles.orderValueFlex]} numberOfLines={1}>{order.restaurantName}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total pago</Text>
              <Text style={[styles.orderValue, styles.orderValuePrimary]}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Entrega em</Text>
              <Text style={styles.orderValue} numberOfLines={1}>{order.address.split("–")[0].trim()}</Text>
            </View>
          </View>
        )}

        <View style={styles.etaBanner}>
          <Text style={styles.etaEmoji}>🛵</Text>
          <View>
            <Text style={styles.etaLabel}>Tempo estimado de entrega</Text>
            <Text style={styles.etaTime}>30–45 min</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/orders")} style={styles.primaryBtn}>
            <ClipboardList size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Ver meus pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/")} style={styles.secondaryBtn}>
            <Home size={20} color={colors.textMuted} />
            <Text style={styles.secondaryBtnText}>Voltar ao início</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#dcfce7", alignItems: "center", justifyContent: "center", marginBottom: 24 },
    content: { alignItems: "center", width: "100%" },
    title: { fontSize: 24, fontWeight: "700", color: colors.text, textAlign: "center" },
    subtitle: { color: colors.textMuted, textAlign: "center", marginTop: 8, fontSize: 15, lineHeight: 22 },
    orderCard: { backgroundColor: colors.cardAlt, borderRadius: 16, padding: 16, marginTop: 24, width: "100%", gap: 12 },
    orderRow: { flexDirection: "row", justifyContent: "space-between" },
    orderLabel: { color: colors.textMuted, fontSize: 13 },
    orderValue: { fontWeight: "600", color: colors.text, fontSize: 13 },
    orderValueFlex: { flex: 1, textAlign: "right", marginLeft: 16 },
    orderValuePrimary: { color: "#ff4757", fontWeight: "700" },
    etaBanner: { backgroundColor: "#fef3c7", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16, flexDirection: "row", alignItems: "center", gap: 8, width: "100%" },
    etaEmoji: { fontSize: 20 },
    etaLabel: { fontWeight: "700", color: "#92400e", fontSize: 13 },
    etaTime: { color: "#b45309", fontSize: 22, fontWeight: "800" },
    actions: { width: "100%", gap: 12, marginTop: 32 },
    primaryBtn: { backgroundColor: "#ff4757", borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    primaryBtnText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
    secondaryBtn: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    secondaryBtnText: { color: colors.textMuted, fontWeight: "600", fontSize: 15 },
  });
}
