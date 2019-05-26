// document.querySelector("webview").openDevTools()

const IPC = require('./js/classes/ipc.js');
var ipc = new IPC.serve();

var el = document.querySelector('.chrome-tabs')
var chromeTabs = new ChromeTabs()

chromeTabs.init(el)

var ids = 1;

el.addEventListener('activeTabChange', ({ detail }) => {
  console.log("webview[data-tab-id=\"" + detail.tabEl.getAttribute("data-tab-id") + "\"]");
  var el = document.querySelector("webview[data-tab-id=\"" + detail.tabEl.getAttribute("data-tab-id") + "\"]");

  document.querySelectorAll("webview").forEach(ell => ell.classList.add("hidden"));
  if (el) el.classList.remove("hidden");
})
// el.addEventListener('tabAdd', ({ detail }) => console.log('Tab added', detail.tabEl))
// el.addEventListener('tabRemove', ({ detail }) => console.log('Tab removed', detail.tabEl))

ipc.on("add_tab", () => {


  document.querySelector('.mock-browser-content').innerHTML += '<webview data-tab-id="' + ids + '" src="pages/comic.html" nodeintegration autosize="on"></webview>'
  // setTimeout(() => document.querySelector("webview[data-tab-id=\"" + ids + "\"]").openDevTools(), 1000)
  chromeTabs.addTab({
  title: 'New Tab',
  favicon: false,
  id: ids++
})})

ipc.on("add_tab_background", () => chromeTabs.addTab({
  title: 'New Tab',
  favicon: false
}, {
  background: true
}))

ipc.on("close_tab", () => chromeTabs.removeTab(chromeTabs.activeTabEl))

ipc.on("switch_theme", () => {
  if (el.classList.contains('chrome-tabs-dark-theme')) {
    document.documentElement.classList.remove('dark-theme')
    el.classList.remove('chrome-tabs-dark-theme')
  } else {
    document.documentElement.classList.add('dark-theme')
    el.classList.add('chrome-tabs-dark-theme')
  }
})

const {remote} = require('electron')

document.getElementById("min-btn").addEventListener("click", function(e) {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

document.getElementById("max-btn").addEventListener("click", function(e) {
  var window = remote.BrowserWindow.getFocusedWindow();
  window.isMaximized() ? window.unmaximize() : window.maximize();
});

document.getElementById("close-btn").addEventListener("click", function(e) {
  remote.BrowserWindow.getFocusedWindow().close();
});
