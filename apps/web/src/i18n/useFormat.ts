import { useLanguage } from "./context";

/** Locale-aware dates. Arabic keeps Western digits (0-9), like Egyptian university portals. */
export function useFormat() {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB";
  return {
    date: (d: Date | string, options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options).format(typeof d === "string" ? new Date(d) : d),
    relativeDays: (n: number) => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(n, "day"),
  };
}
