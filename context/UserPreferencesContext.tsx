import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface UserPreferencesContextType {
  selectedTypes: string[];
  selectedRestrictions: string[];
  toggleType: (type: string) => void;
  toggleRestriction: (restriction: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = "@foodmatch:preferences";

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedTypes) setSelectedTypes(parsed.selectedTypes);
        if (parsed.selectedRestrictions) setSelectedRestrictions(parsed.selectedRestrictions);
      }
    });
  }, []);

  const persist = (types: string[], restrictions: string[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedTypes: types, selectedRestrictions: restrictions }));
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type];
      persist(next, selectedRestrictions);
      return next;
    });
  };

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) => {
      const next = prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction];
      persist(selectedTypes, next);
      return next;
    });
  };

  return (
    <UserPreferencesContext.Provider value={{ selectedTypes, selectedRestrictions, toggleType, toggleRestriction }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  return context;
}
