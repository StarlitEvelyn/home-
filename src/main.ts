import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Tray } from "electron";
import path from "node:path";
import { clearURL, getHAURL, getWindowBounds, saveURL, saveWindowBounds, showMainWindow, showTaskBar, toggleAutostart, toggleTaskBar } from "./functions";
const indexPath = path.join(__dirname, "index.html");

let allowQuit = false;
const lock = app.requestSingleInstanceLock();
let mainWindow: BrowserWindow | null = null;

// Create browserwindow, open homeassitant page
const createWindow = () => {
	const bounds = getWindowBounds();

	mainWindow = new BrowserWindow({
		...bounds,
		autoHideMenuBar: true,
		skipTaskbar: showTaskBar(),
		title: "Home-",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.on("close", function (event) {
		if (!allowQuit) {
			event.preventDefault();
			mainWindow.hide();
		}

		return false;
	});

	const url = getHAURL();

	// Check if homeassitant address is set, otherwise request it before opening page
	if (!url) mainWindow.loadFile(indexPath);
	else mainWindow.loadURL(url);

	// Save window location on close
	mainWindow.on("close", () => {
		saveWindowBounds(mainWindow);
	});
};

let tray = null;
if (!lock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	app.whenReady().then(() => {
		globalShortcut.register("Shift+CommandOrControl+H", () => {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		});

		createWindow();

		// Create a tray
		const trayIconPath = path.join(__dirname, "logo.png");
		const trayIcon = nativeImage.createFromPath(trayIconPath);
		tray = new Tray(trayIcon);
		tray.on("click", () => showMainWindow(mainWindow));

		const contextMenu = Menu.buildFromTemplate([
			{
				label: "Show",
				click: showMainWindow,
			},
			{
				label: "Clear URL",
				click: clearURL,
			},
			{
				label: "Toggle autostart",
				click: toggleAutostart,
			},
			{
				label: "Toggle taskbar icon",
				click: toggleTaskBar,
			},
			{
				label: "Quit",
				click: () => {
					allowQuit = true;
					app.quit();
				},
			},
		]);

		tray.setToolTip("Home-");
		tray.setContextMenu(contextMenu);

		// Wait and handle a request to update url
		ipcMain.on("setUrl", (e, url: string) => {
			saveURL(url);

			// Open new URL
			mainWindow.loadURL(url);
		});

		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow();
			}
		});
	});
}
