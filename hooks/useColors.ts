import { useTheme } from "@/context/ThemeContext";

const light = {
  bg: "#ffffff",
  bgSecondary: "#f3f4f6",
  bgTertiary: "#f9fafb",
  card: "#ffffff",
  cardAlt: "#f9fafb",
  surface: "rgba(243,244,246,0.5)",
  text: "#1f2937",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  border: "#f3f4f6",
  borderStrong: "#e5e7eb",
  inputBg: "#f3f4f6",
};

const dark = {
  bg: "#111827",
  bgSecondary: "#1f2937",
  bgTertiary: "#1f2937",
  card: "#1f2937",
  cardAlt: "#1f2937",
  surface: "rgba(55,65,81,0.5)",
  text: "#f9fafb",
  textMuted: "#9ca3af",
  textLight: "#6b7280",
  border: "#374151",
  borderStrong: "#374151",
  inputBg: "#374151",
};

export function useColors() {
  const { theme } = useTheme();
  return theme === "dark" ? dark : light;
}
