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
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        mainWindow.webContents.openDevTools();
    });

    // Open external links in system browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

}

app.whenReady().then(() => {

    // Register deep link protocol
    app.setAsDefaultProtocolClient("cms");

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

});

/* ================= Deep Link Handler ================= */

app.on("open-url", (event, url) => {

    event.preventDefault();

    const parsed = new URL(url);

    const token = parsed.searchParams.get("token");
    const role = parsed.searchParams.get("role");

    if (token && mainWindow) {

        mainWindow.webContents.executeJavaScript(`
            localStorage.setItem("token","${token}");
            localStorage.setItem("role","${role}");
            window.location.href="/oauth-success";
        `);

    }

});

/* ================= Close App ================= */

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});