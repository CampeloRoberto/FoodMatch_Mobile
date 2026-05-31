import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Restaurant } from "@/types";

interface FavoritesContextType {
  favorites: Restaurant[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    apiFetch<Restaurant[]>("/favorites", { auth: true })
      .then(setFavorites)
      .catch(console.error);
  }, [user]);

  const isFavorite = (id: number) => favorites.some((r) => r.id === id);

  const toggleFavorite = async (id: number) => {
    if (isFavorite(id)) {
      setFavorites((prev) => prev.filter((r) => r.id !== id));
      await apiFetch(`/favorites/${id}`, { method: "DELETE", auth: true });
    } else {
      await apiFetch(`/favorites/${id}`, { method: "POST", auth: true });
      const updated = await apiFetch<Restaurant[]>("/favorites", { auth: true });
      setFavorites(updated);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
