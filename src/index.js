import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import { dynamicActivate, defaultLocale } from "./i18n";
import { useEffect } from "react";

const I18nApp = () => {
  useEffect(() => {
    // With this method we dynamically load the catalogs
    dynamicActivate(
      localStorage?.getItem("language")
        ? localStorage?.getItem("language")
        : "en"
    );
  }, []);
  return (
    <React.StrictMode>
      <I18nProvider i18n={i18n}>
        <App />
      </I18nProvider>
    </React.StrictMode>
  );
};
ReactDOM.createRoot(document.getElementById("root")).render(<I18nApp />);
