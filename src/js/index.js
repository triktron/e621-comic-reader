const Store = require('electron-store');
const prompt = require('electron-prompt');
const electron = require('electron')
const got = require('got');
const Bottleneck = require("bottleneck/es5");
const fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');
var tmp = require('tmp');
var mkdirp = require('mkdirp');

const config_folder = electron.remote.app.getPath("appData") + "\\e621-comic-reader";

const store = new Store({
  cwd: config_folder
});

const limiter = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 2
});

var comics;
startup()
// start the app
function startup() {
  // get all the stored comics
  comics = store.get("comics", {});

  console.log(comics);
}

// add a comic to the database
function add_comic(id) {
  console.log(id);
  comics[id] = {
    pages: []
  }
  store.set("comics", comics);
  update_comic(id);
}

// update comic data
function update_comic(id, p = 1) {
  var comic = comics[id];
  var pages = [];

  got("https://e621.net/pool/show/" + id + ".json?page=" + p).then((r) => JSON.parse(r.body)).then(data => {
      pages = data.posts.map(post => {
        return {
          description: post.description,
          file_url: post.file_url,
          preview_url: post.preview_url,
          sources: post.sources,
          id:post.id
        }
      })
      comic.name = data.name;
      if (p == 1) comic.pages = pages; else comic.pages = comic.pages.concat(pages);
      p++;

    store.set("comics", comics);

    if (pages.length > 0) setTimeout(() => update_comic(id, p),500); else download_comic(id);
  })

}

const DownloadManager = require('./js/download');
var dm = new DownloadManager(() => {
  document.querySelector(".chrome-tabs-bottom-bar.progress").style.display = dm.progress() == 0 ? "none" : "block";
  document.querySelector(".chrome-tabs-bottom-bar.progress").style.width = dm.progress() * 100 + "%";
})

function download_comic(id) {
  comics[id].pages.forEach((page) => {
    var path = config_folder + "\\comics\\" + id + "\\" + page.id + "." + page.file_url.split(".").pop();
    dm.download(page.file_url, path);
  })
}

document.querySelector('button[data-add-comic]').addEventListener('click', _ => {
  prompt({
      title: 'Add a comic',
      label: 'Please enter the ID of the comic',
      inputAttrs: {
        type: 'number'
      },
      height: 145
    })
    .then((r) => {
      if (r) add_comic(r);
    })
    .catch(console.error);
})

const {
  remote
} = require('electron')


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
