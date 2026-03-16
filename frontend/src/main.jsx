import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StatusBar } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import App from "./App";
import "./index.css";

/* ===================== Theme Bootstrap ===================== */

const applyTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    } else {
        // Fallback to system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDark) {
            document.documentElement.classList.add("dark");
        }
    }
};

applyTheme();
StatusBar.hide();

if (Capacitor.isNativePlatform()) {

    CapacitorApp.addListener("appUrlOpen", (event) => {

        const url = new URL(event.url);

        const token = url.searchParams.get("token");
        const role = url.searchParams.get("role");

        if (token) {

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            window.location.href = "/oauth-success";

        }

    });

}
/* ===================== Render ===================== */

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);