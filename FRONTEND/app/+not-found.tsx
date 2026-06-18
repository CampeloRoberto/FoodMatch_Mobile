import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-6xl mb-4">🍽️</Text>
      <Text className="text-2xl font-bold text-foreground mb-2 text-center">
        Página não encontrada
      </Text>
      <Text className="text-muted-foreground text-center mb-8">
        Ops! Parece que esse prato saiu do cardápio.
      </Text>
      <Pressable
        onPress={() => router.replace("/(tabs)")}
        className="bg-primary px-8 py-4 rounded-full"
      >
        <Text className="text-white font-semibold">Voltar ao Início</Text>
      </Pressable>
    </SafeAreaView>
  );
}
