/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { BrowserWindow } from "electron";

const showMainWindow = () => {
	try {
		BrowserWindow.getAllWindows()[0].show();
	} catch (e) {
		console.log(e);
	}
};

const clearURL = (store) => {
	store.set("URL", null);
	if (BrowserWindow.getAllWindows()[0]) BrowserWindow.getAllWindows()[0].loadFile(indexPath);
};

const saveURL = (url, store) => {
	store.set("URL", url);
};

const getWindowBounds = (store) => {
	return store.get("windowBounds") || { width: 800, height: 600 };
};

const saveWindowBounds = (mainWindow, store) => {
	if (mainWindow) store.set("windowBounds", mainWindow.getBounds());
};

const showTaskBar = (store) => {
	return store.get("taskbar") ?? false;
};

const toggleTaskBar = (store) => {
	const taskbar = store.get("taskbar");
	if (taskbar) store.set("taskar", false);
	else store.set("taskbar", true);
};

const toggleAutostart = (store) => {
	const start = store.get("autostart");
	if (!start) {
		// Enable autostart
		app.setLoginItemSettings({
			openAtLogin: true,
		});

		// Update store
		store.set("autostart", true);
	} else {
		// Disable autostart
		app.setLoginItemSettings({
			openAtLogin: false,
		});

		// Update store
		store.set("autostart", false);
	}
};

const getHAURL = (store) => {
	return store.get("URL") ?? null;
};

export { showMainWindow, clearURL, getWindowBounds, showTaskBar, getHAURL, saveWindowBounds, toggleTaskBar, toggleAutostart, saveURL };
