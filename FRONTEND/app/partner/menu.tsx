import { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image,
  Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform,
  Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChefHat, Plus, Pencil, Trash2, X, Check } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, getToken } from "@/services/api";
import { useColors } from "@/hooks/useColors";
import type { MenuItem } from "@/types";

const CATEGORIES = ["Entradas", "Pratos Principais", "Bebidas", "Sobremesas"];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

interface FormState {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const emptyForm = (): FormState => ({ name: "", description: "", price: "", category: CATEGORIES[0], image: "" });

export default function PartnerMenuScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const styles = makeStyles(colors);

  const restaurantId = user?.restaurantId;

  const [items, setItems]               = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading]           = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [editingItem, setEditingItem]   = useState<MenuItem | null>(null);
  const [form, setForm]                 = useState<FormState>(emptyForm());
  const [formError, setFormError]       = useState("");

  const load = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const [data, restaurant] = await Promise.all([
        apiFetch<MenuItem[]>(`/restaurants/${restaurantId}/menu`),
        apiFetch<{ name: string }>(`/restaurants/${restaurantId}`),
      ]);
      setItems(data);
      setRestaurantName(restaurant.name);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o cardápio.");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm());
    setFormError("");
    setModalVisible(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name:        item.name,
      description: item.description,
      price:       item.price.toString(),
      category:    item.category,
      image:       item.image ?? "",
    });
    setFormError("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.name.trim())        { setFormError("Informe o nome do prato"); return; }
    if (!form.description.trim()) { setFormError("Informe a descrição"); return; }
    const price = parseFloat(form.price.replace(",", "."));
    if (isNaN(price) || price <= 0) { setFormError("Informe um preço válido"); return; }
    if (!form.category)           { setFormError("Selecione a categoria"); return; }

    setSaving(true);
    try {
      const token = await getToken();
      const body: Record<string, unknown> = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price,
        category:    form.category,
      };
      if (form.image.trim()) body.image = form.image.trim();

      if (editingItem) {
        const updated = await apiFetch<MenuItem>(`/restaurants/${restaurantId}/menu/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } else {
        const created = await apiFetch<MenuItem>(`/restaurants/${restaurantId}/menu`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems((prev) => [...prev, created]);
      }
      setModalVisible(false);
    } catch (e: any) {
      setFormError(e.message ?? "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      "Remover prato",
      `Deseja remover "${item.name}" do cardápio?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              await apiFetch(`/restaurants/${restaurantId}/menu/${item.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              setItems((prev) => prev.filter((i) => i.id !== item.id));
            } catch {
              Alert.alert("Erro", "Não foi possível remover o prato.");
            }
          },
        },
      ]
    );
  };

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    data:     items.filter((i) => i.category === cat),
  })).filter((g) => g.data.length > 0);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image || DEFAULT_IMAGE }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.itemDesc, { color: colors.textMuted }]} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace(".", ",")}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={[styles.actionBtn, styles.editBtn]}>
          <Pencil size={16} color="#ff4757" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, styles.deleteBtn]}>
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = (
    <LinearGradient colors={["#ff4747", "#ff5252"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
      {restaurantName ? (
        <Text style={styles.restaurantName}>{restaurantName}</Text>
      ) : null}
      <View style={styles.headerRow}>
        <ChefHat size={28} color="#fff" />
        <Text style={styles.headerTitle}>Gerenciar Cardápio</Text>
      </View>
      <Text style={styles.headerSubtitle}>{items.length} {items.length === 1 ? "prato" : "pratos"} cadastrado{items.length === 1 ? "" : "s"}</Text>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]} edges={["top"]}>
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ff4757" />
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          renderItem={({ item: group }) => (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{group.category}</Text>
              {group.data.map((item) => (
                <View key={item.id}>{renderItem({ item })}</View>
              ))}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <ChefHat size={56} color="#d1d5db" />
              <Text style={[styles.emptyTitle, { color: colors.textMuted }]}>Cardápio vazio</Text>
              <Text style={[styles.emptySub, { color: colors.textLight }]}>Toque em "+" para adicionar seu primeiro prato</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openCreate}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal form */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingItem ? "Editar prato" : "Novo prato"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Nome do prato *</Text>
              <TextInput
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Ex: Picanha Grelhada"
                placeholderTextColor={colors.textLight}
                style={[styles.modalInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              />

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Descrição *</Text>
              <TextInput
                value={form.description}
                onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                placeholder="Descreva o prato..."
                placeholderTextColor={colors.textLight}
                style={[styles.modalInput, styles.modalTextArea, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
                multiline
                numberOfLines={3}
              />

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Preço (R$) *</Text>
              <TextInput
                value={form.price}
                onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
                placeholder="Ex: 49,90"
                placeholderTextColor={colors.textLight}
                keyboardType="decimal-pad"
                style={[styles.modalInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              />

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Categoria *</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setForm((f) => ({ ...f, category: cat }))}
                    style={[styles.catChip, form.category === cat && styles.catChipActive, { borderColor: form.category === cat ? "#ff4757" : colors.border, backgroundColor: form.category === cat ? "rgba(255,71,87,0.08)" : colors.inputBg }]}
                  >
                    <Text style={[styles.catChipText, { color: form.category === cat ? "#ff4757" : colors.textMuted }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>URL da imagem (opcional)</Text>
              <TextInput
                value={form.image}
                onChangeText={(v) => setForm((f) => ({ ...f, image: v }))}
                placeholder="https://..."
                placeholderTextColor={colors.textLight}
                autoCapitalize="none"
                keyboardType="url"
                style={[styles.modalInput, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
              />

              {formError ? <Text style={styles.formError}>{formError}</Text> : null}

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={[styles.saveBtn, { opacity: saving ? 0.75 : 1 }]}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Check size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>{editingItem ? "Salvar alterações" : "Adicionar prato"}</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    container:    { flex: 1 },
    loadingBox:   { flex: 1, alignItems: "center", justifyContent: "center" },
    listContent:  { paddingBottom: 100 },
    header:         { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 16 },
    restaurantName: { color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
    headerRow:      { flexDirection: "row", alignItems: "center", gap: 12 },
    headerTitle:    { color: "#fff", fontSize: 22, fontWeight: "700" },
    headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    section:      { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
    itemCard:     { flexDirection: "row", borderRadius: 14, overflow: "hidden", marginBottom: 10, elevation: 2 },
    itemImage:    { width: 80, height: 80 },
    itemInfo:     { flex: 1, padding: 10, justifyContent: "space-between" },
    itemName:     { fontWeight: "600", fontSize: 14 },
    itemDesc:     { fontSize: 12, marginTop: 2, lineHeight: 16 },
    itemPrice:    { color: "#ff4757", fontWeight: "700", fontSize: 13, marginTop: 4 },
    itemActions:  { padding: 8, gap: 8, justifyContent: "center" },
    actionBtn:    { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    editBtn:      { backgroundColor: "rgba(255,71,87,0.1)" },
    deleteBtn:    { backgroundColor: "rgba(239,68,68,0.1)" },
    fab:          { position: "absolute", bottom: 24, right: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: "#ff4757", alignItems: "center", justifyContent: "center", elevation: 6 },
    emptyBox:     { alignItems: "center", paddingTop: 64, paddingHorizontal: 32 },
    emptyTitle:   { fontSize: 18, fontWeight: "600", marginTop: 16 },
    emptySub:     { fontSize: 13, marginTop: 6, textAlign: "center" },
    modalHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    modalTitle:   { fontSize: 20, fontWeight: "700" },
    modalBody:    { padding: 20, gap: 6, paddingBottom: 40 },
    fieldLabel:   { fontSize: 13, fontWeight: "600", marginTop: 12, marginBottom: 4 },
    modalInput:   { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    modalTextArea: { height: 80, textAlignVertical: "top" },
    categoryRow:  { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    catChip:      { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
    catChipActive: {},
    catChipText:  { fontSize: 13, fontWeight: "600" },
    formError:    { color: "#ef4444", fontSize: 13, textAlign: "center", marginTop: 8 },
    saveBtn:      { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#ff4757", borderRadius: 16, paddingVertical: 16, marginTop: 20 },
    saveBtnText:  { color: "#fff", fontWeight: "700", fontSize: 16 },
  });
}
