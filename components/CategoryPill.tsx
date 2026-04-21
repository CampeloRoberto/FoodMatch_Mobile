import { Pressable, Text, View } from "react-native";

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
      className={`flex-row items-center gap-2 px-4 py-2 rounded-full mr-2 ${
        isActive ? "bg-primary shadow-md" : "bg-white shadow-sm"
      }`}
    >
      <Text className="text-lg">{icon}</Text>
      <Text className={`text-sm font-medium ${isActive ? "text-white" : "text-foreground"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
