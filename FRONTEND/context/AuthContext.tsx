import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, saveToken, removeToken, getToken } from "@/services/api";
import type { UserRole } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  address: string | null;
  role: UserRole;
  restaurantId: number | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerPartner: (name: string, email: string, password: string, restaurantId: number) => Promise<void>;
  createRestaurantPartner: (name: string, email: string, password: string, restaurantName: string, category: string, priceRange: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then(async (token) => {
      if (token) {
        try {
          const me = await apiFetch<User>("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(me);
        } catch {
          await removeToken();
        }
      }
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const registerPartner = async (name: string, email: string, password: string, restaurantId: number) => {
    const res = await apiFetch<{ token: string; user: User }>("/auth/register-partner", {
      method: "POST",
      body: JSON.stringify({ name, email, password, restaurantId }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const createRestaurantPartner = async (name: string, email: string, password: string, restaurantName: string, category: string, priceRange: string) => {
    const res = await apiFetch<{ token: string; user: User }>("/auth/create-partner", {
      method: "POST",
      body: JSON.stringify({ name, email, password, restaurantName, category, priceRange }),
    });
    await saveToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, registerPartner, createRestaurantPartner, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
