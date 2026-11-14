import { useEffect } from "react";
import { useLanguage } from "../i18n/context";

export function usePageTitle(title: string) {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = `${t.brand} · ${title}`;
  }, [t, title]);
}
