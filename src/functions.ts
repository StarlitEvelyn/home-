/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { BrowserWindow } from "electron";
import store from "./storage";

const showMainWindow = () => {
	try {
		BrowserWindow.getAllWindows()[0].show();
	} catch (e) {
		console.log(e);
	}
};

const clearURL = () => {
	store.set("URL", null);
	if (BrowserWindow.getAllWindows()[0]) BrowserWindow.getAllWindows()[0].loadFile(indexPath);
};

const saveURL = (url) => {
	store.set("URL", url);
};

const getWindowBounds = () => {
	return store.get("windowBounds") || { width: 800, height: 600 };
};

const saveWindowBounds = (mainWindow) => {
	store.set("windowBounds", mainWindow.getBounds());
};

const showTaskBar = () => {
	return store.get("taskbar") ?? false;
};

const toggleTaskBar = () => {
	const taskbar = store.get("taskbar");
	if (taskbar) store.set("taskar", false);
	else store.set("taskbar", true);
};

const toggleAutostart = () => {
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

const getHAURL = () => {
	return store.get("URL") ?? null;
};

export { showMainWindow, clearURL, getWindowBounds, showTaskBar, getHAURL, saveWindowBounds, toggleTaskBar, toggleAutostart, saveURL };
