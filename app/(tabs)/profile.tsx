import { useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Moon,
  Phone,
  Shield,
  SlidersHorizontal,
  User,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const profileFields = [
  { icon: <Mail size={20} color="#ff4757" />, label: "Email", value: "roberto@email.com" },
  { icon: <Phone size={20} color="#ff4757" />, label: "Telefone", value: "(11) 98765-4321" },
  { icon: <MapPin size={20} color="#ff4757" />, label: "Endereço", value: "Rua das Flores, 123 - São Paulo, SP" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const colors = useColors();
  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#ff4757" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil e Configurações</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.card}>
          <View style={styles.profileTop}>
            <LinearGradient colors={["#ff4757", "#ff5252"]} style={styles.avatarGradient}>
              <User size={40} color="white" />
            </LinearGradient>
            <View>
              <Text style={styles.profileName}>Roberto</Text>
              <Text style={styles.profileSince}>Membro desde Mar 2024</Text>
            </View>
          </View>

          <View style={styles.fieldsGap}>
            {profileFields.map((field) => (
              <View key={field.label} style={styles.fieldRow}>
                {field.icon}
                <View style={styles.fieldTexts}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Payment */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
          <View style={styles.cardTitleRow}>
            <CreditCard size={24} color="#ff4757" />
            <Text style={styles.cardTitle}>Informações de Pagamento</Text>
          </View>

          <LinearGradient colors={["#ff4757", "#ff5252"]} style={styles.creditCard}>
            <Text style={styles.creditCardLabel}>Cartão Principal</Text>
            <Text style={styles.creditCardNumber}>•••• •••• •••• 4532</Text>
            <View style={styles.creditCardFooter}>
              <Text style={styles.creditCardText}>ROBERTO</Text>
              <Text style={styles.creditCardText}>12/26</Text>
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.addCardBtn}>
            <CreditCard size={20} color="#ff4757" />
            <Text style={styles.addCardBtnText}>Adicionar Novo Cartão</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Filters shortcut */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
          <TouchableOpacity style={styles.filterRow} onPress={() => router.back()}>
            <View style={styles.filterLeft}>
              <SlidersHorizontal size={20} color="#ff4757" />
              <View>
                <Text style={styles.settingLabel}>Preferências e Filtros</Text>
                <Text style={styles.settingDesc}>Culinárias favoritas e restrições alimentares</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.card}>
          <Text style={styles.cardTitleStandalone}>Configurações</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#ff4757" />
              <View>
                <Text style={styles.settingLabel}>Notificações</Text>
                <Text style={styles.settingDesc}>Receber alertas de novos matches</Text>
              </View>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: "#d1d5db", true: "#ff4757" }} thumbColor="white" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Moon size={20} color="#ff4757" />
              <View>
                <Text style={styles.settingLabel}>Modo Escuro</Text>
                <Text style={styles.settingDesc}>Tema escuro para economia de bateria</Text>
              </View>
            </View>
            <Switch value={theme === "dark"} onValueChange={toggleTheme} trackColor={{ false: "#d1d5db", true: "#ff4757" }} thumbColor="white" />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Globe size={20} color="#ff4757" />
              <View>
                <Text style={styles.settingLabel}>Idioma</Text>
                <Text style={styles.settingDesc}>Português (Brasil)</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Shield size={20} color="#ff4757" />
              <View>
                <Text style={styles.settingLabel}>Privacidade e Segurança</Text>
                <Text style={styles.settingDesc}>Gerencie suas preferências de privacidade</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgSecondary },
    header: { backgroundColor: colors.card, paddingHorizontal: 24, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 16, elevation: 2 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgSecondary, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 22, fontWeight: "600", color: "#ff4757" },
    scroll: { flex: 1 },
    scrollContent: { padding: 24, paddingBottom: 40, gap: 24 },
    card: { backgroundColor: colors.card, borderRadius: 24, padding: 24, elevation: 3 },
    profileTop: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 },
    avatarGradient: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
    profileName: { fontSize: 22, fontWeight: "600", color: colors.text, marginBottom: 4 },
    profileSince: { color: colors.textMuted, fontSize: 13 },
    fieldsGap: { gap: 12 },
    fieldRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: colors.surface, borderRadius: 12 },
    fieldTexts: { flex: 1 },
    fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
    fieldValue: { color: colors.text, fontSize: 14 },
    cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
    cardTitle: { fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 4 },
    cardTitleStandalone: { fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 16 },
    creditCard: { borderRadius: 12, padding: 16, marginBottom: 12 },
    creditCardLabel: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginBottom: 8 },
    creditCardNumber: { color: "#ffffff", fontSize: 18, letterSpacing: 4, marginBottom: 12 },
    creditCardFooter: { flexDirection: "row", justifyContent: "space-between" },
    creditCardText: { color: "#ffffff", fontSize: 13 },
    addCardBtn: { width: "100%", padding: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(255,71,87,0.3)", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    addCardBtnText: { color: "#ff4757", fontWeight: "500", fontSize: 14 },
    filterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    filterLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 4 },
    settingLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    settingLabel: { color: colors.text, fontSize: 14, fontWeight: "500" },
    settingDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    logoutBtn: { backgroundColor: colors.card, paddingVertical: 16, borderRadius: 16, elevation: 3, alignItems: "center" },
    logoutText: { color: "#ef4444", fontWeight: "600", fontSize: 15 },
  });
}
