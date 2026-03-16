import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../release/index.html"));
    mainWindow.webContents.on("will-redirect", (event, url) => {

        if (url.includes("/oauth-success")) {

            event.preventDefault();

            const parsed = new URL(url);
            const token = parsed.searchParams.get("token");
            const role = parsed.searchParams.get("role");

            mainWindow.webContents.executeJavaScript(`
            localStorage.setItem("token","${token}");
            localStorage.setItem("role","${role}");
            window.location.href="/oauth-success";
        `);

        }

    });

    mainWindow.webContents.on("will-navigate", (event, url) => {

        if (url.includes("/oauth-success")) {

            event.preventDefault();

            const parsed = new URL(url);
            const token = parsed.searchParams.get("token");
            const role = parsed.searchParams.get("role");

            mainWindow.webContents.executeJavaScript(`
            localStorage.setItem("token","${token}");
            localStorage.setItem("role","${role}");
            window.location.href="/oauth-success";
        `);
        }

    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {

        if (url.includes("/oauth-success")){

            const parsed = new URL(url);
            const token = parsed.searchParams.get("token");
            const role = parsed.searchParams.get("role");

            mainWindow.webContents.executeJavaScript(`
                localStorage.setItem("token","${token}");
                localStorage.setItem("role","${role}");
                window.location.href="/oauth-success";
            `);

            return { action: "deny" };
        }

        shell.openExternal(url);
        return { action: "deny" };
    });

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});