const supportedLngs = ["vi", "en", "fr"];

export const ni18nConfig = {
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ["translation"],
  react: {
    useSuspense: false,
  },
};
