const Path = require('path');
const fs = require('fs');
const electron = require('electron');

const Comic = require('./comic.js');

class Handler {
  constructor() {
    this.data_path = Path.join(electron.remote.app.getPath('appData'), 'comic-reader', 'comics');

    this.update();
    this.updateCovers();
  }

  update() {
    const self = this;
    this.comics = [];

    fs.readdirSync(this.data_path).forEach((handlerName) => {
      const handlerPath = Path.join(this.data_path, handlerName);
      if (!fs.lstatSync(handlerPath).isDirectory()) return;

      fs.readdirSync(handlerPath).forEach((comicID) => {
        const comicPath = Path.join(handlerPath, comicID);
        if (fs.lstatSync(comicPath).isDirectory()) {
          self.comics.push({ handler: handlerName, id: comicID });
        }
      });
    });
  }

  updateCovers() {
    const c = new Comic();

    for (var comic of this.comics) { // eslint-disable-line
      c.id = comic.id;
      c.handler = comic.handler;
      c.loadFromFile();
      comic.cover = c.pages[0].url;
      comic.name = c.name;
    }
  }
}

module.exports = Handler;
