"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "ar" | "en";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");
  const [dir, setDir] = useState<Direction>("rtl");

  useEffect(() => {
    // Initial setup or restore from local storage if needed
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLanguage(newLang);
  };

  const setLanguage = (newLang: Language) => {
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setLang(newLang);
    setDir(newDir);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newDir;
  };

  return (
    <LanguageContext.Provider
      value={{ lang, dir, toggleLanguage, setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
