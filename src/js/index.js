const Store = require('electron-store');
const prompt = require('electron-prompt');
const electron = require('electron')
const got = require('got');
const Bottleneck = require("bottleneck/es5");
const fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');

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
function update_comic(id) {
  var comic = comics[id];

  got("https://e621.net/pool/show/" + id + ".json").then((r) => JSON.parse(r.body)).then(data => {
    comic.name = data.name;
    comic.pages = data.posts.map(post => {
      return {
        description: post.description,
        file_url: post.file_url,
        preview_url: post.preview_url,
        sources: post.sources,
        id:post.id
      }
    })

    store.set("comics", comics);
  })
}

function download_comic(id) {
  var comic = comics[id];


  comic.pages.forEach((page) => {
    if (!fs.existsSync(config_folder + "\\comics\\" + id + "\\" + page.id)) {

      limiter.schedule(() => new Promise(function(resolve, reject) {
        console.log(page.file_url);
        resolve();
      }))
    }
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
