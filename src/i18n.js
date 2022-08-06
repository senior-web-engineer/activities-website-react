import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
const lang = JSON.parse(sessionStorage.getItem("language"))?.value || "en";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: `${lang}`,
    backend: {
      /* translation file path */
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
    },
    fallbackLng: "en",
    debug: false,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
      useSuspense: false,
    },
  });

export default i18n;
