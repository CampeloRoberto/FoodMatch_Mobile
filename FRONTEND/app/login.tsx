import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const { login, register } = useAuth();
  const colors = useColors();
  const styles = makeStyles(colors);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (mode === "register" && !name.trim()) {
      setError("Informe seu nome");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
    } catch (e: any) {
      setError(e.message ?? "Erro ao entrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff4757" }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header com logo */}
          <LinearGradient
            colors={["#ff4757", "#ff5252"]}
            style={styles.header}
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            <Text style={styles.appName}>FoodMatch</Text>
            <Text style={styles.tagline}>Seu app de restaurantes favoritos</Text>
          </LinearGradient>

          {/* Card com formulário */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Toggle login / cadastro */}
            <View style={[styles.toggle, { backgroundColor: colors.inputBg }]}>
              <TouchableOpacity
                onPress={() => switchMode("login")}
                style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, mode === "login" && styles.toggleTextActive]}>
                  Entrar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => switchMode("register")}
                style={[styles.toggleBtn, mode === "register" && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, mode === "register" && styles.toggleTextActive]}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campos */}
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.btn, { opacity: loading ? 0.75 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.hint, { color: colors.textLight }]}>
              {mode === "login"
                ? "Não tem conta? Toque em \"Criar conta\""
                : "Já tem conta? Toque em \"Entrar\""}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    header: {
      alignItems: "center",
      paddingTop: 40,
      paddingBottom: 48,
      paddingHorizontal: 24,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
    },
    appName: {
      color: "#fff",
      fontSize: 34,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    tagline: {
      color: "rgba(255,255,255,0.85)",
      fontSize: 14,
      marginTop: 6,
    },
    card: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 28,
      marginTop: -24,
      gap: 14,
    },
    toggle: {
      flexDirection: "row",
      borderRadius: 14,
      padding: 4,
      marginBottom: 4,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 11,
      alignItems: "center",
      borderRadius: 11,
    },
    toggleBtnActive: { backgroundColor: "#ff4757" },
    toggleText: { fontWeight: "600", fontSize: 14, color: colors.textMuted },
    toggleTextActive: { color: "#fff" },
    input: {
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
    },
    error: {
      color: "#ef4444",
      fontSize: 13,
      textAlign: "center",
    },
    btn: {
      backgroundColor: "#ff4757",
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
    },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    hint: { fontSize: 13, textAlign: "center", marginTop: 4 },
  });
}
