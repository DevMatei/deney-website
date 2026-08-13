import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeSettings {
  mode: ThemeMode;
  disableAnimations: boolean;
  highHz: boolean;
  bentoTilt: boolean;
  sidebarCollapsed: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  actualTheme: "light" | "dark";
  cycleTheme: () => void;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  mode: "system",
  disableAnimations: false,
  highHz: false,
  bentoTilt: true,
  sidebarCollapsed: false,
};

const HUES = {
  primaryHue: 65,
  primaryChroma: 0.17,
  secondaryHue: 70,
  secondaryChroma: 0.09,
  tertiaryHue: 160,
  tertiaryChroma: 0.11,
  neutralHue: 65,
  neutralChroma: 0.02,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem("deney-settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("dark");

  useLayoutEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const resolved =
        settings.mode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : settings.mode;
      setActualTheme(resolved);
      root.classList.toggle("dark", resolved === "dark");
    };
    apply();
    if (settings.mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [settings.mode]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-hue", HUES.primaryHue.toString());
    root.style.setProperty("--primary-chroma", HUES.primaryChroma.toFixed(3));
    root.style.setProperty("--secondary-hue", HUES.secondaryHue.toString());
    root.style.setProperty("--secondary-chroma", HUES.secondaryChroma.toFixed(3));
    root.style.setProperty("--tertiary-hue", HUES.tertiaryHue.toString());
    root.style.setProperty("--tertiary-chroma", HUES.tertiaryChroma.toFixed(3));
    root.style.setProperty("--neutral-hue", HUES.neutralHue.toString());
    root.style.setProperty("--neutral-chroma", HUES.neutralChroma.toFixed(3));
    try {
      localStorage.setItem("deney-settings", JSON.stringify(settings));
    } catch {
    }
  }, [settings]);

  const cycleTheme = useCallback(() => {
    setSettings((prev) => ({ ...prev, mode: actualTheme === "light" ? "dark" : "light" }));
  }, [actualTheme]);

  const updateSettings = useCallback((newSettings: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, actualTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
