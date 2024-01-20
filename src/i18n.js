import { i18n } from "@lingui/core";

export const lngs = {
  en: { nativeName: "English", flag: "https://flagsapi.com/US/shiny/16.png" },
  ko: { nativeName: "Korean", flag: "https://flagsapi.com/KR/shiny/16.png" },
};
export const defaultLocale = "en";

//load and activate the default locale before dynamic loading
i18n.load(defaultLocale, {});
i18n.activate(defaultLocale);
export async function dynamicActivate(locale) {
  const { messages } = await import(`./locales/${locale}/messages`);

  i18n.load(locale, messages);
  i18n.activate(locale);
  localStorage.setItem("language", locale);
}
