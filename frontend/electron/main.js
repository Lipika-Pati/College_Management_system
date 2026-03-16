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

    // Catch navigation events (OAuth redirect)
    mainWindow.webContents.on("will-navigate", (event, url) => {

        if (url.startsWith("http://localhost/oauth-success")) {

            event.preventDefault();

            const parsed = new URL(url);
            const token = parsed.searchParams.get("token");
            const role = parsed.searchParams.get("role");

            if (token) {

                mainWindow.webContents.executeJavaScript(`
                    localStorage.setItem("token","${token}");
                    localStorage.setItem("role","${role}");
                    window.location.href="/oauth-success";
                `);

            }

        }

    });

    // Handle window.open
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {

        if (url.startsWith("http://localhost/oauth-success")) {

            const parsed = new URL(url);
            const token = parsed.searchParams.get("token");
            const role = parsed.searchParams.get("role");

            if (token) {

                mainWindow.webContents.executeJavaScript(`
                    localStorage.setItem("token","${token}");
                    localStorage.setItem("role","${role}");
                    window.location.href="/oauth-success";
                `);

            }

            return { action: "deny" };
        }

        shell.openExternal(url);
        return { action: "deny" };
    });

}

app.whenReady().then(() => {

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});