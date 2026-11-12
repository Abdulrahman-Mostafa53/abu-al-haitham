import { createContext, useContext } from "react";
import type { Dict, Lang } from "./translations";

export interface LanguageValue {
  lang: Lang;
  t: Dict;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageValue | null>(null);

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
