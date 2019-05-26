const { ipcRenderer } = require('electron')

const IPC = require('../js/classes/ipc.js');
var ipc = new IPC.connect();

document.querySelector('button[data-add-tab]').addEventListener('click', _ => ipc.emit("add_tab"))
document.querySelector('button[data-add-background-tab]').addEventListener('click', _ => ipc.emit("add_tab_background"))
document.querySelector('button[data-remove-tab]').addEventListener('click', _ => ipc.emit("close_tab"))
document.querySelector('button[data-theme-toggle]').addEventListener('click', _ => ipc.emit("switch_theme"))
