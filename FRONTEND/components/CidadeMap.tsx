import React, { useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, Animated as RNAnimated } from "react-native";
import Svg, { Rect, Circle, Path, Text as SvgText, G } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type MapRestaurant = {
  id: number;
  name: string;
  distance: string;
  mapX: number;
  mapY: number;
};

type Props = {
  restaurants: MapRestaurant[];
  selectedId: number | null;
  routeToId: number | null;
  onSelectRestaurant: (id: number) => void;
};

const MAP_W = 600;
const MAP_H = 600;
const USER_X = 280;
const USER_Y = 310;
const MIN_SCALE = 0.9;
const MAX_SCALE = 4;

// React Native Animated component for SVG Path (strokeDashoffset animation)
const AnimatedPath = RNAnimated.createAnimatedComponent(Path);

export default function CidadeMap({ restaurants, selectedId, routeToId, onSelectRestaurant }: Props) {
  // ── Gesture / zoom state ──────────────────────────────────────────
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTX = useSharedValue(0);
  const savedTY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart(() => { savedScale.value = scale.value; })
    .onUpdate((e) => {
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * e.scale));
    });

  const pan = Gesture.Pan()
    .onStart(() => { savedTX.value = translateX.value; savedTY.value = translateY.value; })
    .onUpdate((e) => {
      translateX.value = savedTX.value + e.translationX;
      translateY.value = savedTY.value + e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value, { damping: 20 });
      translateY.value = withSpring(translateY.value, { damping: 20 });
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 300 });
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    });

  const composed = Gesture.Simultaneous(
    Gesture.Race(doubleTap, pan),
    pinch
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // ── Route animation ───────────────────────────────────────────────
  const routeRestaurant = routeToId != null
    ? restaurants.find((r) => r.id === routeToId) ?? null
    : null;

  const routeLen = routeRestaurant
    ? Math.abs(USER_X - routeRestaurant.mapX) + Math.abs(USER_Y - routeRestaurant.mapY) + 30
    : 600;

  const dashOffset = useRef(new RNAnimated.Value(routeLen)).current;

  useEffect(() => {
    if (routeRestaurant) {
      const len = Math.abs(USER_X - routeRestaurant.mapX) + Math.abs(USER_Y - routeRestaurant.mapY) + 30;
      dashOffset.setValue(len);
      RNAnimated.timing(dashOffset, {
        toValue: 0,
        duration: 900,
        useNativeDriver: false,
      }).start();
    }
  }, [routeToId]);

  const routePath = routeRestaurant
    ? `M ${USER_X} ${USER_Y} L ${routeRestaurant.mapX} ${USER_Y} L ${routeRestaurant.mapX} ${routeRestaurant.mapY}`
    : "";

  // ── Pin tap ────────────────────────────────────────────────────────
  const handlePinTap = useCallback((id: number) => onSelectRestaurant(id), [onSelectRestaurant]);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.svgWrapper, animStyle]}>
          {/* viewBox makes the full 600×600 city visible in whatever space is given */}
          <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`}>

            {/* ── Fundo bege ── */}
            <Rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#e8dfc8" />

            {/* ── Rio Cidadezinha ── */}
            <Rect x={0} y={0} width={72} height={MAP_H} fill="#a8d8ea" />
            <Rect x={60} y={0} width={14} height={MAP_H} fill="#7ec8e3" />
            <SvgText x={12} y={300} fontSize={10} fill="#1a6e8a" fontWeight="bold"
              transform="rotate(-90, 12, 300)" textAnchor="middle">Rio Cidadezinha</SvgText>

            {/* ── Calçadão ── */}
            <Rect x={72} y={0} width={10} height={MAP_H} fill="#c8b89a" />

            {/* ── Quarteirões ── */}
            <Rect x={85}  y={10}  width={165} height={105} fill="#f5e6c8" />
            <Rect x={260} y={10}  width={160} height={105} fill="#ead9c0" />
            <Rect x={430} y={10}  width={165} height={105} fill="#f0dfc0" />
            <Rect x={85}  y={175} width={110} height={110} fill="#f0e8d0" />
            <Rect x={205} y={175} width={155} height={110} fill="#ffe8cc" />
            <Rect x={370} y={175} width={110} height={110} fill="#f5e0c5" />
            <Rect x={490} y={175} width={105} height={110} fill="#ead8b8" />
            <Rect x={85}  y={345} width={110} height={115} fill="#eee0c5" />
            <Rect x={205} y={345} width={155} height={115} fill="#f5e8d0" />
            <Rect x={370} y={345} width={225} height={115} fill="#ead5b0" />
            <Rect x={85}  y={475} width={510} height={120} fill="#e8dcc0" />

            {/* ── Praça Central ── */}
            <Rect x={207} y={177} width={151} height={106} rx={8} ry={8} fill="#8bc34a" />
            <Rect x={225} y={195} width={115} height={70}  rx={6} ry={6} fill="#7cb342" />
            <Circle cx={282} cy={225} r={20} fill="#558b2f" />
            <Circle cx={305} cy={213} r={14} fill="#558b2f" />
            <Circle cx={264} cy={218} r={12} fill="#558b2f" />
            <SvgText x={282} y={252} fontSize={8} fill="#fff" fontWeight="bold" textAnchor="middle">Praça Central</SvgText>

            {/* ── Parque Beira-Rio ── */}
            <Rect x={82} y={360} width={112} height={95} rx={4} ry={4} fill="#a5d6a7" />
            <Circle cx={115} cy={395} r={16} fill="#66bb6a" />
            <Circle cx={148} cy={385} r={12} fill="#66bb6a" />
            <Circle cx={130} cy={415} r={10} fill="#66bb6a" />
            <SvgText x={138} y={447} fontSize={7} fill="#2e7d32" fontWeight="bold" textAnchor="middle">Parque Beira-Rio</SvgText>

            {/* ══ RUAS ══ */}
            <Rect x={82}  y={118} width={513} height={18} fill="#d4c8a8" />
            <Rect x={82}  y={124} width={513} height={6}  fill="#c8bc9c" />
            <SvgText x={300} y={131} fontSize={7} fill="#8a7a5a" textAnchor="middle">Av. Beira-Rio</SvgText>

            <Rect x={82}  y={288} width={513} height={20} fill="#d4c8a8" />
            <Rect x={82}  y={294} width={513} height={6}  fill="#c8bc9c" />
            <SvgText x={300} y={302} fontSize={7} fill="#8a7a5a" textAnchor="middle">Av. Central</SvgText>

            <Rect x={82}  y={463} width={513} height={14} fill="#d4c8a8" />
            <SvgText x={300} y={473} fontSize={7} fill="#8a7a5a" textAnchor="middle">R. das Palmeiras</SvgText>

            <Rect x={82}  y={0}   width={16}  height={MAP_H} fill="#d4c8a8" />

            <Rect x={248} y={0}   width={14}  height={MAP_H} fill="#d4c8a8" />
            <SvgText x={255} y={60} fontSize={7} fill="#8a7a5a" textAnchor="middle"
              transform="rotate(-90, 255, 60)">R. das Flores</SvgText>

            <Rect x={358} y={0}   width={14}  height={MAP_H} fill="#d4c8a8" />
            <SvgText x={365} y={80} fontSize={7} fill="#8a7a5a" textAnchor="middle"
              transform="rotate(-90, 365, 80)">R. do Comércio</SvgText>

            <Rect x={478} y={0}   width={14}  height={MAP_H} fill="#d4c8a8" />
            <SvgText x={485} y={70} fontSize={7} fill="#8a7a5a" textAnchor="middle"
              transform="rotate(-90, 485, 70)">R. da Praia</SvgText>

            {/* ── Av. Diagonal ── */}
            <Path d="M 82 480 L 595 120" stroke="#c8b880" strokeWidth={14} fill="none" />
            <Path d="M 82 480 L 595 120" stroke="#d4c890" strokeWidth={10} fill="none" />
            <Path d="M 82 480 L 595 120" stroke="#c8bc80" strokeWidth={3}  fill="none" strokeDasharray="12,8" />
            <SvgText x={400} y={265} fontSize={8} fill="#8a7a4a" fontWeight="bold" textAnchor="middle"
              transform="rotate(-29, 400, 265)">Av. das Nações</SvgText>

            {/* ══ ROTA ANIMADA ══ */}
            {routeRestaurant && (
              <>
                {/* Sombra da rota */}
                <Path
                  d={routePath}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={7}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Linha da rota animada */}
                <AnimatedPath
                  d={routePath}
                  stroke="#4285f4"
                  strokeWidth={5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${routeLen}`}
                  strokeDashoffset={dashOffset}
                />
                {/* Destaque sobre a linha */}
                <Path
                  d={routePath}
                  stroke="rgba(66,133,244,0.25)"
                  strokeWidth={12}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* ══ PINOS DOS RESTAURANTES ══ */}
            {restaurants.map((r) => {
              const isSelected = r.id === selectedId;
              const hasRoute = r.id === routeToId;
              return (
                <G key={r.id} onPress={() => handlePinTap(r.id)}>
                  <Circle cx={r.mapX + 2} cy={r.mapY + 2} r={isSelected ? 15 : 11} fill="rgba(0,0,0,0.2)" />
                  <Circle
                    cx={r.mapX} cy={r.mapY}
                    r={isSelected ? 15 : 11}
                    fill={hasRoute ? "#1a56cc" : isSelected ? "#ff2d2d" : "#ff4757"}
                    stroke="#fff"
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <SvgText x={r.mapX} y={r.mapY + 4} fontSize={isSelected ? 10 : 8}
                    textAnchor="middle" fill="#fff">🍽</SvgText>
                  <Rect
                    x={r.mapX - 34} y={r.mapY - 34}
                    width={68} height={15}
                    rx={4} ry={4}
                    fill="rgba(255,255,255,0.93)"
                    stroke={hasRoute ? "#4285f4" : isSelected ? "#ff2d2d" : "#ddd"}
                    strokeWidth={hasRoute || isSelected ? 1.5 : 0.8}
                  />
                  <SvgText
                    x={r.mapX} y={r.mapY - 23}
                    fontSize={6.5} textAnchor="middle"
                    fill={hasRoute ? "#1a56cc" : isSelected ? "#cc0000" : "#333"}
                    fontWeight={isSelected || hasRoute ? "bold" : "normal"}
                  >
                    {r.name.length > 13 ? r.name.slice(0, 13) + "…" : r.name}
                  </SvgText>
                </G>
              );
            })}

            {/* ══ USUÁRIO ══ */}
            <Circle cx={USER_X} cy={USER_Y} r={22} fill="rgba(66,133,244,0.15)" />
            <Circle cx={USER_X} cy={USER_Y} r={14} fill="rgba(66,133,244,0.32)" />
            <Circle cx={USER_X} cy={USER_Y} r={8}  fill="#4285f4" stroke="#fff" strokeWidth={2.5} />
            <SvgText x={USER_X} y={USER_Y + 26} fontSize={7} fill="#1a56cc" fontWeight="bold" textAnchor="middle">Você</SvgText>

            {/* ══ NOME DA CIDADE ══ */}
            <Rect x={172} y={543} width={254} height={22} rx={6} ry={6} fill="rgba(255,255,255,0.55)" />
            <SvgText x={299} y={558} fontSize={11} fill="#5a4a2a" fontWeight="bold" textAnchor="middle">
              🏙 Cidadezinha
            </SvgText>
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 400,
    overflow: "hidden",
    backgroundColor: "#e8dfc8",
    borderRadius: 20,
  },
  svgWrapper: {
    width: "100%",
    height: "100%",
  },
});
