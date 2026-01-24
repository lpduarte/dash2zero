import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    // Ler do localStorage no primeiro render
    const stored = localStorage.getItem("darkMode");
    return stored === "true";
  });

  useEffect(() => {
    // Aplicar classe ao documento
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Guardar no localStorage
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const setDarkMode = (value: boolean) => setDarkModeState(value);
  const toggleDarkMode = () => setDarkModeState(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
