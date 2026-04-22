import { useColors } from "@/hooks/useColors";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Check, X } from "lucide-react-native";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CUISINE_TYPES = [
  "Brasileira", "Italiana", "Japonesa", "Mexicana",
  "Chinesa", "Árabe", "Fast Food", "Vegana",
  "Vegetariana", "Frutos do Mar",
];

const DIETARY_RESTRICTIONS = [
  "Sem Glúten", "Sem Lactose", "Vegano", "Vegetariano",
  "Kosher", "Halal", "Sem Nozes", "Sem Frutos do Mar",
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function FilterModal({ visible, onClose }: Props) {
  const colors = useColors();
  const styles = makeStyles(colors);
  const { selectedTypes, selectedRestrictions, toggleType, toggleRestriction } = useUserPreferences();

  const totalActive = selectedTypes.length + selectedRestrictions.length;

  const clearAll = () => {
    selectedTypes.forEach((t) => toggleType(t));
    selectedRestrictions.forEach((r) => toggleRestriction(r));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <View style={styles.headerActions}>
            {totalActive > 0 && (
              <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
                <Text style={styles.clearText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Cuisines */}
          <Text style={styles.sectionTitle}>Tipos de Culinária</Text>
          <Text style={styles.sectionSub}>Mostra apenas restaurantes dessas categorias</Text>
          <View style={styles.pillsWrap}>
            {CUISINE_TYPES.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => toggleType(type)}
                  style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                >
                  {active && <Check size={13} color="white" />}
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Restrictions */}
          <Text style={[styles.sectionTitle, styles.sectionTitleGap]}>Restrições Alimentares</Text>
          <Text style={styles.sectionSub}>Suas restrições serão exibidas nos resultados</Text>
          <View style={styles.pillsWrap}>
            {DIETARY_RESTRICTIONS.map((restriction) => {
              const active = selectedRestrictions.includes(restriction);
              return (
                <TouchableOpacity
                  key={restriction}
                  onPress={() => toggleRestriction(restriction)}
                  style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
                >
                  {active && <Check size={13} color="white" />}
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{restriction}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>
              {totalActive > 0 ? `Aplicar ${totalActive} filtro${totalActive > 1 ? "s" : ""}` : "Aplicar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: "80%",
      paddingBottom: 32,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.borderStrong,
      borderRadius: 2,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { fontSize: 20, fontWeight: "700", color: colors.text },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
    clearBtn: { paddingVertical: 4, paddingHorizontal: 8 },
    clearText: { fontSize: 14, color: "#ff4757", fontWeight: "500" },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.bgSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 4 },
    sectionTitleGap: { marginTop: 28 },
    sectionSub: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
    pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
    },
    pillActive: { backgroundColor: "#ff4757" },
    pillInactive: { backgroundColor: colors.bgSecondary },
    pillText: { fontSize: 14, color: colors.text },
    pillTextActive: { color: "#ffffff", fontWeight: "500" },
    footer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    applyBtn: {
      backgroundColor: "#ff4757",
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    applyText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  });
}
