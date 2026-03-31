import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const LANGUAGE_STORAGE_KEY = "appLanguagePreference";
const SUPPORTED_LANGUAGES = ["en", "fr"];

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  const path =
    (window.location && window.location.pathname
      ? window.location.pathname
      : ""
    ).toLowerCase();

  if (
    path.startsWith("/fr/") ||
    path === "/fr" ||
    path === "/fr.html"
  ) {
    return "fr";
  }

  if (
    path.startsWith("/en/") ||
    path === "/en" ||
    path === "/en.html"
  ) {
    return "en";
  }

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
  } catch (err) {
    // Ignore storage access issues and fall back to default language
  }
  return "en";
};

const persistLanguagePreference = (lng) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch (err) {
    // Ignore storage access issues so language changes still work
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    lng: getInitialLanguage(),              
    fallbackLng: "en",      
    interpolation: {
      escapeValue: false    
    }
  });

i18n.on("languageChanged", persistLanguagePreference);

export default i18n;
