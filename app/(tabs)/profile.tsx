import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Moon,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { useTheme } from "@/context/ThemeContext";

const restaurantTypes = [
  "Brasileira", "Italiana", "Japonesa", "Mexicana",
  "Chinesa", "Árabe", "Fast Food", "Vegana",
  "Vegetariana", "Frutos do Mar",
];

const dietaryRestrictions = [
  "Sem Glúten", "Sem Lactose", "Vegano", "Vegetariano",
  "Kosher", "Halal", "Sem Nozes", "Sem Frutos do Mar",
];

export default function ProfileScreen() {
  const router = useRouter();
  const { selectedTypes, selectedRestrictions, toggleType, toggleRestriction } = useUserPreferences();
  const [notifications, setNotifications] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-secondary dark:bg-gray-900" edges={["top"]}>
      {/* Sticky Header */}
      <View className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 flex-row items-center gap-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-secondary items-center justify-center"
        >
          <ArrowLeft size={20} color="#ff4757" />
        </Pressable>
        <Text className="text-2xl font-semibold text-primary">
          Perfil e Configurações
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <Animated.View
          entering={FadeInDown.delay(0).duration(400)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6"
        >
          <View className="flex-row items-center gap-4 mb-6">
            <LinearGradient
              colors={["#ff4757", "#ff5252"]}
              style={{ width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" }}
            >
              <User size={40} color="white" />
            </LinearGradient>
            <View>
              <Text className="text-2xl font-semibold text-foreground dark:text-white mb-1">
                Roberto
              </Text>
              <Text className="text-muted-foreground dark:text-gray-400">
                Membro desde Mar 2024
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {[
              { icon: <Mail size={20} color="#ff4757" />, label: "Email", value: "roberto@email.com" },
              { icon: <Phone size={20} color="#ff4757" />, label: "Telefone", value: "(11) 98765-4321" },
              { icon: <MapPin size={20} color="#ff4757" />, label: "Endereço", value: "Rua das Flores, 123 - São Paulo, SP" },
            ].map((item) => (
              <View
                key={item.label}
                className="flex-row items-center gap-3 p-4 bg-secondary/50 dark:bg-gray-700/50 rounded-xl"
              >
                {item.icon}
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground dark:text-gray-400">
                    {item.label}
                  </Text>
                  <Text className="text-foreground dark:text-white">{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Payment */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6"
        >
          <View className="flex-row items-center gap-2 mb-4">
            <CreditCard size={24} color="#ff4757" />
            <Text className="text-xl font-semibold text-foreground dark:text-white">
              Informações de Pagamento
            </Text>
          </View>

          <LinearGradient
            colors={["#ff4757", "#ff5252"]}
            style={{ borderRadius: 12, padding: 16, marginBottom: 12 }}
          >
            <Text className="text-white/90 text-sm mb-2">Cartão Principal</Text>
            <Text className="text-white text-lg tracking-widest mb-3">
              •••• •••• •••• 4532
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-white text-sm">ROBERTO</Text>
              <Text className="text-white text-sm">12/26</Text>
            </View>
          </LinearGradient>

          <Pressable className="w-full p-4 border-2 border-dashed border-primary/30 rounded-xl flex-row items-center justify-center gap-2">
            <CreditCard size={20} color="#ff4757" />
            <Text className="text-primary font-medium">Adicionar Novo Cartão</Text>
          </Pressable>
        </Animated.View>

        {/* Cuisine Preferences */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6"
        >
          <Text className="text-xl font-semibold text-foreground dark:text-white mb-2">
            Tipos de Culinária Favoritos
          </Text>
          <Text className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Selecione seus tipos de restaurante preferidos
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {restaurantTypes.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <Pressable
                  key={type}
                  onPress={() => toggleType(type)}
                  className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                    active ? "bg-primary" : "bg-secondary dark:bg-gray-700"
                  }`}
                >
                  {active && <Check size={14} color="white" />}
                  <Text className={`${active ? "text-white" : "text-foreground dark:text-gray-200"}`}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Dietary Restrictions */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6"
        >
          <Text className="text-xl font-semibold text-foreground dark:text-white mb-2">
            Restrições Alimentares
          </Text>
          <Text className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
            Informe suas restrições para filtrar pratos adequados
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {dietaryRestrictions.map((restriction) => {
              const active = selectedRestrictions.includes(restriction);
              return (
                <Pressable
                  key={restriction}
                  onPress={() => toggleRestriction(restriction)}
                  className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                    active ? "bg-primary" : "bg-secondary dark:bg-gray-700"
                  }`}
                >
                  {active && <Check size={14} color="white" />}
                  <Text className={`${active ? "text-white" : "text-foreground dark:text-gray-200"}`}>
                    {restriction}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6"
        >
          <Text className="text-xl font-semibold text-foreground dark:text-white mb-4">
            Configurações
          </Text>
          <View className="gap-2">
            {/* Notifications */}
            <View className="flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center gap-3 flex-1">
                <Bell size={20} color="#ff4757" />
                <View>
                  <Text className="text-foreground dark:text-white">Notificações</Text>
                  <Text className="text-sm text-muted-foreground dark:text-gray-400">
                    Receber alertas de novos matches
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#d1d5db", true: "#ff4757" }}
                thumbColor="white"
              />
            </View>

            {/* Dark Mode */}
            <View className="flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center gap-3 flex-1">
                <Moon size={20} color="#ff4757" />
                <View>
                  <Text className="text-foreground dark:text-white">Modo Escuro</Text>
                  <Text className="text-sm text-muted-foreground dark:text-gray-400">
                    Tema escuro para economia de bateria
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ false: "#d1d5db", true: "#ff4757" }}
                thumbColor="white"
              />
            </View>

            {/* Language */}
            <Pressable className="flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center gap-3">
                <Globe size={20} color="#ff4757" />
                <View>
                  <Text className="text-foreground dark:text-white">Idioma</Text>
                  <Text className="text-sm text-muted-foreground dark:text-gray-400">
                    Português (Brasil)
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </Pressable>

            {/* Privacy */}
            <Pressable className="flex-row items-center justify-between p-4 rounded-xl">
              <View className="flex-row items-center gap-3">
                <Shield size={20} color="#ff4757" />
                <View>
                  <Text className="text-foreground dark:text-white">Privacidade e Segurança</Text>
                  <Text className="text-sm text-muted-foreground dark:text-gray-400">
                    Gerencie suas preferências de privacidade
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <Pressable className="bg-white dark:bg-gray-800 py-4 rounded-2xl shadow-lg items-center">
            <Text className="text-destructive font-semibold text-base">
              Sair da Conta
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
