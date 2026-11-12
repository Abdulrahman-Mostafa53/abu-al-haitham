import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LanguageContext } from "./context";
import { translations, type Lang } from "./translations";

const KEY = "ah-lang";

function getInitialLang(): Lang {
  try {
    return localStorage.getItem(KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: translations[lang],
      toggleLang: () => setLang((l) => (l === "en" ? "ar" : "en")),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
