import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NotificationsProvider } from "@mantine/notifications";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationsProvider position="bottom-center">
      <App />
    </NotificationsProvider>
  </React.StrictMode>
);
