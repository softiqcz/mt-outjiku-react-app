import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import cz from "./cz.json";
import de from "./de.json";
import en from "./en.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        cz: { translation: cz },
        de: { translation: de },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "cz", "de"],
      returnNull: false,
      detection: {
        order: ["htmlTag"],
        caches: [],
      },
      interpolation: { escapeValue: false },
    });
}

export default i18n;
