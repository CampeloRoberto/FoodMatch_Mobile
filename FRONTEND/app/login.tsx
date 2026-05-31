import { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image,
  ScrollView, Modal, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, Search, Store, User, X } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/services/api";
import { useColors } from "@/hooks/useColors";
import type { Restaurant } from "@/types";

type UserType = "cliente" | "parceiro";
type Mode     = "login" | "register";

export default function LoginScreen() {
  const { login, register, registerPartner } = useAuth();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [userType, setUserType]           = useState<UserType>("cliente");
  const [mode, setMode]                   = useState<Mode>("login");
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");

  const [restaurants, setRestaurants]           = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [pickerVisible, setPickerVisible]       = useState(false);
  const [pickerSearch, setPickerSearch]         = useState("");

  useEffect(() => {
    apiFetch<Restaurant[]>("/restaurants").then(setRestaurants).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (mode === "register" && !name.trim()) { setError("Informe seu nome"); return; }
    if (!email.trim() || !password.trim())   { setError("Preencha todos os campos"); return; }
    if (userType === "parceiro" && mode === "register" && !selectedRestaurant) {
      setError("Selecione seu restaurante"); return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else if (userType === "cliente") {
        await register(name.trim(), email.trim(), password);
      } else {
        await registerPartner(name.trim(), email.trim(), password, selectedRestaurant!.id);
      }
    } catch (e: any) {
      setError(e.message ?? "Erro ao entrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const switchType = (t: UserType) => { setUserType(t); setError(""); setSelectedRestaurant(null); };
  const switchMode = (m: Mode)     => { setMode(m); setError(""); };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff4757" }} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <LinearGradient colors={["#ff4757", "#ff5252"]} style={styles.header}>
            <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
            <Text style={styles.appName}>FoodMatch</Text>
            <Text style={styles.tagline}>Seu app de restaurantes favoritos</Text>
          </LinearGradient>

          <View style={[styles.card, { backgroundColor: colors.card }]}>

            {/* Toggle Cliente / Parceiro */}
            <View style={styles.typeRow}>
              <TouchableOpacity
                onPress={() => switchType("cliente")}
                style={[styles.typeBtn, userType === "cliente" && styles.typeBtnActive]}
              >
                <User size={16} color={userType === "cliente" ? "#ff4757" : colors.textMuted} />
                <Text style={[styles.typeText, userType === "cliente" && styles.typeTextActive]}>
                  Sou Cliente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchType("parceiro")}
                style={[styles.typeBtn, userType === "parceiro" && styles.typeBtnActive]}
              >
                <Store size={16} color={userType === "parceiro" ? "#ff4757" : colors.textMuted} />
                <Text style={[styles.typeText, userType === "parceiro" && styles.typeTextActive]}>
                  Sou Restaurante
                </Text>
              </TouchableOpacity>
            </View>

            {/* Toggle Entrar / Criar conta */}
            <View style={[styles.toggle, { backgroundColor: colors.inputBg }]}>
              <TouchableOpacity onPress={() => switchMode("login")} style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}>
                <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchMode("register")} style={[styles.toggleBtn, mode === "register" && styles.toggleBtnActive]}>
                <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>Criar conta</Text>
              </TouchableOpacity>
            </View>

            {mode === "register" && (
              <TextInput
                placeholder="Nome completo"
                value={name}
                onChangeText={setName}
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}

            <TextInput
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              placeholderTextColor={colors.textLight}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Seletor de restaurante (só para parceiro em modo registro) */}
            {userType === "parceiro" && mode === "register" && (
              <TouchableOpacity
                style={[styles.restaurantPicker, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                onPress={() => setPickerVisible(true)}
              >
                <Store size={18} color={selectedRestaurant ? "#ff4757" : colors.textLight} />
                <Text style={[styles.restaurantPickerText, { color: selectedRestaurant ? colors.text : colors.textLight }]} numberOfLines={1}>
                  {selectedRestaurant ? selectedRestaurant.name : "Selecione seu restaurante"}
                </Text>
                <ChevronDown size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}

            {userType === "parceiro" && mode === "login" && (
              <View style={[styles.infoBanner, { backgroundColor: colors.inputBg }]}>
                <Text style={[styles.infoText, { color: colors.textMuted }]}>
                  Use o e-mail e senha do seu cadastro de parceiro.
                </Text>
              </View>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[styles.btn, { opacity: loading ? 0.75 : 1 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.btnText}>{mode === "login" ? "Entrar" : "Criar conta"}</Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.hint, { color: colors.textLight }]}>
              {mode === "login" ? "Não tem conta? Toque em \"Criar conta\"" : "Já tem conta? Toque em \"Entrar\""}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal seletor de restaurante */}
      <Modal visible={pickerVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPickerVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
          <View style={[styles.pickerHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Selecione seu restaurante</Text>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={[styles.pickerSearchRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Search size={18} color={colors.textLight} />
            <TextInput
              placeholder="Buscar restaurante..."
              value={pickerSearch}
              onChangeText={setPickerSearch}
              style={[styles.pickerSearchInput, { color: colors.text }]}
              placeholderTextColor={colors.textLight}
            />
          </View>
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerItem, selectedRestaurant?.id === item.id && styles.pickerItemActive, { borderBottomColor: colors.border }]}
                onPress={() => { setSelectedRestaurant(item); setPickerVisible(false); setPickerSearch(""); }}
              >
                <View style={styles.pickerItemLeft}>
                  <Image source={{ uri: item.image }} style={styles.pickerItemImage} />
                  <View>
                    <Text style={[styles.pickerItemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.pickerItemCategory, { color: colors.textMuted }]}>{item.category}</Text>
                  </View>
                </View>
                {selectedRestaurant?.id === item.id && (
                  <View style={styles.pickerCheckMark}>
                    <Text style={styles.pickerCheckMarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    header: { alignItems: "center", paddingTop: 40, paddingBottom: 48, paddingHorizontal: 24 },
    logo:   { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
    appName:  { color: "#fff", fontSize: 34, fontWeight: "700", letterSpacing: 0.5 },
    tagline:  { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 6 },
    card: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, marginTop: -24, gap: 14 },
    typeRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
    typeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: "transparent" },
    typeBtnActive: { borderColor: "#ff4757", backgroundColor: "rgba(255,71,87,0.06)" },
    typeText: { fontWeight: "600", fontSize: 13, color: colors.textMuted },
    typeTextActive: { color: "#ff4757" },
    toggle: { flexDirection: "row", borderRadius: 14, padding: 4, marginBottom: 4 },
    toggleBtn: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 11 },
    toggleBtnActive: { backgroundColor: "#ff4757" },
    toggleText: { fontWeight: "600", fontSize: 14, color: colors.textMuted },
    toggleTextActive: { color: "#fff" },
    input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
    restaurantPicker: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 },
    restaurantPickerText: { flex: 1, fontSize: 15 },
    infoBanner: { borderRadius: 12, padding: 12 },
    infoText: { fontSize: 13, textAlign: "center" },
    error: { color: "#ef4444", fontSize: 13, textAlign: "center" },
    btn: { backgroundColor: "#ff4757", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4 },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    hint: { fontSize: 13, textAlign: "center", marginTop: 4 },
    pickerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    pickerTitle: { fontSize: 18, fontWeight: "700" },
    pickerSearchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 16, marginVertical: 12, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
    pickerSearchInput: { flex: 1, fontSize: 15 },
    pickerItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
    pickerItemActive: { backgroundColor: "rgba(255,71,87,0.05)" },
    pickerItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    pickerItemImage: { width: 44, height: 44, borderRadius: 8 },
    pickerItemName: { fontWeight: "600", fontSize: 15 },
    pickerItemCategory: { fontSize: 12, marginTop: 2 },
    pickerCheckMark: { width: 24, height: 24, backgroundColor: "#ff4757", borderRadius: 12, alignItems: "center", justifyContent: "center" },
    pickerCheckMarkText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  });
}
