import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { findRestaurantById } from "@/data/restaurants";
import type { Restaurant } from "@/types";

interface FavoritesContextType {
  favoriteIds: number[];
  favorites: Restaurant[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const STORAGE_KEY = "@foodmatch:favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed: number[] = JSON.parse(stored);
          setFavoriteIds(parsed);
        } catch {}
      }
    });
  }, []);

  const persist = (ids: number[]) =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      persist(next);
      return next;
    });
  };

  const isFavorite = (id: number) => favoriteIds.includes(id);

  const favorites = favoriteIds
    .map((id) => findRestaurantById(id))
    .filter(Boolean) as Restaurant[];

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
