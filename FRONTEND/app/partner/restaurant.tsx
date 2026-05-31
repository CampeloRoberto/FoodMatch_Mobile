import { useCallback, useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Image,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Store, Save, Moon, LogOut } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, getToken } from "@/services/api";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";

interface RestaurantData {
  id: number;
  name: string;
  description: string | null;
  phone: string | null;
  hours: string | null;
  address: string | null;
  image: string;
  priceRange: string;
  category: string;
  rating: number;
}

interface FormState {
  name: string;
  description: string;
  phone: string;
  hours: string;
  address: string;
  image: string;
  priceRange: string;
}

export default function PartnerRestaurantScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState<FormState>({ name: "", description: "", phone: "", hours: "", address: "", image: "", priceRange: "" });

  const load = useCallback(async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const data = await apiFetch<RestaurantData>(`/restaurants/${user.restaurantId}`);
      setRestaurant(data);
      setForm({
        name:        data.name ?? "",
        description: data.description ?? "",
        phone:       data.phone ?? "",
        hours:       data.hours ?? "",
        address:     data.address ?? "",
        image:       data.image ?? "",
        priceRange:  data.priceRange ?? "",
      });
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados do restaurante.");
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert("Atenção", "O nome do restaurante é obrigatório."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      const updated = await apiFetch<RestaurantData>(`/restaurants/${user!.restaurantId}`, {
        method: "PUT",
        body: JSON.stringify({
          name:        form.name.trim(),
          description: form.description.trim() || undefined,
          phone:       form.phone.trim() || undefined,
          hours:       form.hours.trim() || undefined,
          address:     form.address.trim() || undefined,
          image:       form.image.trim() || undefined,
          priceRange:  form.priceRange.trim() || undefined,
        }),
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurant(updated);
      Alert.alert("Salvo!", "Dados do restaurante atualizados com sucesso.");
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ff4757" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <LinearGradient colors={["#ff4747", "#ff5252"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
            <View style={styles.headerRow}>
              <Store size={28} color="#fff" />
              <Text style={styles.headerTitle}>Meu Restaurante</Text>
            </View>
            {restaurant && (
              <Text style={styles.headerSubtitle}>
                {restaurant.category} · ⭐ {restaurant.rating.toFixed(1)}
              </Text>
            )}
          </LinearGradient>

          {/* Preview da imagem */}
          {(form.image || restaurant?.image) ? (
            <Image
              source={{ uri: form.image || restaurant?.image }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : null}

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Informações do Restaurante</Text>

            {(
              [
                { label: "Nome *",         key: "name",        placeholder: "Nome do restaurante" },
                { label: "Telefone",       key: "phone",       placeholder: "(11) 9xxxx-xxxx" },
                { label: "Horário de funcionamento", key: "hours", placeholder: "Ex: Ter–Dom: 12h–23h" },
                { label: "Endereço",       key: "address",     placeholder: "Rua, número – Bairro, Cidade" },
                { label: "Faixa de preço", key: "priceRange",  placeholder: "$  /  $$  /  $$$" },
                { label: "URL da imagem",  key: "image",       placeholder: "https://...", keyboard: "url" as const },
              ] as { label: string; key: keyof FormState; placeholder: string; keyboard?: "url" | "default" }[]
            ).map(({ label, key, placeholder, keyboard }) => (
              <View key={key}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{label}</Text>
                <TextInput
                  value={form[key]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textLight}
                  keyboardType={keyboard ?? "default"}
                  autoCapitalize={keyboard === "url" ? "none" : "sentences"}
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                />
              </View>
            ))}

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Descreva seu restaurante para os clientes..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
            />

            <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.saveBtn, { opacity: saving ? 0.75 : 1 }]}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Salvar alterações</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Configurações */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Configurações</Text>

            <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
              <View style={styles.settingLeft}>
                <Moon size={20} color="#ff4757" />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Modo Escuro</Text>
                  <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                    {theme === "dark" ? "Ativado" : "Desativado"}
                  </Text>
                </View>
              </View>
              <View style={[styles.togglePill, theme === "dark" && styles.togglePillActive]}>
                <View style={[styles.toggleThumb, theme === "dark" && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.card }]} onPress={logout}>
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container:     { flex: 1 },
    loadingBox:    { flex: 1, alignItems: "center", justifyContent: "center" },
    scrollContent: { paddingBottom: 40, gap: 16 },
    header:        { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerRow:     { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle:   { color: "#fff", fontSize: 22, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    previewImage:  { width: "100%", height: 180, marginTop: -12 },
    card:          { marginHorizontal: 16, borderRadius: 20, padding: 20, gap: 8, elevation: 2 },
    cardTitle:     { fontSize: 17, fontWeight: "700", marginBottom: 6 },
    fieldLabel:    { fontSize: 12, fontWeight: "600", marginTop: 4 },
    input:         { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginTop: 4 },
    textArea:      { height: 100, textAlignVertical: "top" },
    saveBtn:       { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#ff4757", borderRadius: 14, paddingVertical: 14, marginTop: 8 },
    saveBtnText:   { color: "#fff", fontWeight: "700", fontSize: 15 },
    settingRow:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
    settingLeft:   { flexDirection: "row", alignItems: "center", gap: 12 },
    settingLabel:  { fontWeight: "600", fontSize: 14 },
    settingDesc:   { fontSize: 12, marginTop: 2 },
    togglePill:    { width: 46, height: 26, borderRadius: 13, backgroundColor: "#d1d5db", justifyContent: "center", paddingHorizontal: 3 },
    togglePillActive: { backgroundColor: "#ff4757" },
    toggleThumb:   { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", elevation: 2 },
    toggleThumbActive: { alignSelf: "flex-end" },
    logoutBtn:     { marginHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, elevation: 2 },
    logoutText:    { color: "#ef4444", fontWeight: "600", fontSize: 15 },
  });
}
