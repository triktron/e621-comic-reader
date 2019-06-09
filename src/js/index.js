/* global ChromeTabs */

const IPC = require('./js/classes/ipc.js');
const isDev = require('electron-is-dev');
const { remote } = require('electron');

const ipc = new IPC.Serve();
const chromeEl = document.querySelector('.chrome-tabs');
const chromeTabs = new ChromeTabs();

chromeTabs.init(chromeEl);

let ids = 1;

chromeEl.addEventListener('activeTabChange', ({ detail }) => {
  const el = document.querySelector(`webview[data-tab-id="${detail.tabEl.getAttribute('data-tab-id')}"]`);

  document.querySelectorAll('webview').forEach(ell => ell.style.zIndex = 0); // eslint-disable-line no-return-assign, no-param-reassign
  if (el) el.style.zIndex = 10;
});
chromeEl.addEventListener('tabRemove', ({ detail }) => {
  const el = document.querySelector(`webview[data-tab-id="${detail.tabEl.getAttribute('data-tab-id')}"]`);

  el.parentNode.removeChild(el);
});

ipc.on('open_comic', (data) => {
  document.querySelector('.mock-browser-content').innerHTML += `<webview data-tab-id="${ids}" src="pages/comic.html#${data.id}/${data.handler}" nodeintegration autosize="on"></webview>`;

  const webview = document.querySelector(`webview[data-tab-id="${ids}"]`);
  if (isDev) {
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
    });
  }

  chromeTabs.addTab({
    title: data.name,
    favicon: false,
    id: ids,
  });
  ids += 1;
});

ipc.on('switch_theme', () => {
  if (chromeEl.classList.contains('chrome-tabs-dark-theme')) {
    document.documentElement.classList.remove('dark-theme');
    chromeEl.classList.remove('chrome-tabs-dark-theme');

    ipc.emit('switch_theme_light');
  } else {
    document.documentElement.classList.add('dark-theme');
    chromeEl.classList.add('chrome-tabs-dark-theme');

    ipc.emit('switch_theme_dark');
  }
});

document.getElementById('min-btn').addEventListener('click', () => {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

document.getElementById('max-btn').addEventListener('click', () => {
  const window = remote.BrowserWindow.getFocusedWindow();
  if (window.isMaximized()) window.unmaximize(); else window.maximize();
});

document.getElementById('close-btn').addEventListener('click', () => {
  remote.BrowserWindow.getFocusedWindow().close();
});

if (isDev) {
  document.querySelector('webview').addEventListener('dom-ready', () => {
    document.querySelector('webview').openDevTools();
  });
}
