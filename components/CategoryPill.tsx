import { Pressable, Text, StyleSheet } from "react-native";

interface CategoryPillProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryPill({ icon, label, isActive = false, onPress }: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: "#ff4757",
    elevation: 4,
  },
  pillInactive: {
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  labelActive: {
    color: "#ffffff",
  },
  labelInactive: {
    color: "#1f2937",
  },
});
