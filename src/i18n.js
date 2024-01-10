import { i18n } from "@lingui/core";

export const locales = {
  en: "English",
  ko: "Korean",
};
export const defaultLocale = "en";

export async function dynamicActivate(locale) {
  const { messages } = await import(`./locales/${locale}.po`);

  i18n.load(locale, messages);
  i18n.activate(locale);
}
