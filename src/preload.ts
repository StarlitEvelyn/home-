// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	setUrl: (url: string) => ipcRenderer.send("setUrl", url),
	// we can also expose variables, not just functions
});
