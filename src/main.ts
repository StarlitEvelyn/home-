/* eslint-disable @typescript-eslint/ban-ts-comment */
import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from "electron";
import path from "node:path";
import Store from "electron-store";
const store = new Store();

const indexPath = path.join(__dirname, "index.html");

// Create browserwindow, open homeassitant page
const createWindow = () => {
	//@ts-ignore
	const bounds = store.get("windowBounds") || { width: 800, height: 600 };

	const mainWindow = new BrowserWindow({
		...bounds,
		autoHideMenuBar: true,
		title: "Home-",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// Check if homeassitant address is set, otherwise request it before opening page
	// @ts-ignore
	const url = store.get("URL");

	if (!url) mainWindow.loadFile(indexPath);
	else mainWindow.loadURL(url);

	mainWindow.on("close", () => {
		//@ts-ignore
		store.set("windowBounds", mainWindow.getBounds());
	});
};

let tray = null;
app.whenReady().then(() => {
	createWindow();

	// Create a tray
	const trayIconPath = path.join(__dirname, "logo.png");
	const trayIcon = nativeImage.createFromPath(trayIconPath);
	tray = new Tray(trayIcon);
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Clear URL",
			type: "normal",
			click: function () {
				//@ts-ignore
				store.set("URL", null);
				if (BrowserWindow.getAllWindows()[0]) BrowserWindow.getAllWindows()[0].loadFile(indexPath);
			},
		},
		{
			label: "Toggle autostart",
			type: "normal",
			click: function () {
				//@ts-ignore
				const start = store.get("autostart");
				if (!start) {
					console.log("Enabled autostart");
					app.setLoginItemSettings({
						openAtLogin: true,
					});

					//@ts-ignore
					store.set("autostart", true);
				} else {
					console.log("Disabled autostart");

					app.setLoginItemSettings({
						openAtLogin: false,
					});
					//@ts-ignore
					store.set("autostart", false);
				}
			},
		},
	]);
	tray.setToolTip("Home-");
	tray.setContextMenu(contextMenu);

	// Wait and handle a request to update url
	ipcMain.on("setUrl", (e, url: string) => {
		// Save URL
		// @ts-ignore
		store.set("URL", url);

		// Open new URL
		BrowserWindow.getAllWindows()[0].loadURL(url);
	});

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});
