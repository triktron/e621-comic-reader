const fs = require('fs');
const Path = require('path');
const mkdirp = require('mkdirp');
const electron = require('electron');

const plugins = require('./plugins/plugins.js');

class Page {
  fromData(data) {
    this.url = data.url;
    this.width = data.width;
    this.height = data.height;

    return this;
  }
}

class Comic {
  constructor() {
    this.name = '';
    this.pages = [];
    this.pageNumbers = 0;
    this.handler = null;
    this.id = null;
  }

  loadFromFile(path) {
    path = path || Path.join(electron.remote.app.getPath('appData'), 'comic-reader', 'comics', this.handler, String(this.id), 'data.json'); // eslint-disable-line no-param-reassign
    const data = JSON.parse(fs.readFileSync(path));

    return this.loadFromData(data);
  }

  loadFromUrl(url, cb) {
    for (var t in plugins) { // eslint-disable-line
      const id = plugins[t].testUrl(url);
      if (id) {
        this.id = id;
        this.handler = t;
        this.update(() => cb(null));
        return;
      }
    }

    return { err: 'no plugin found' }; // eslint-disable-line
  }

  saveToFile(path) {
    path = path || Path.join(electron.remote.app.getPath('appData'), 'comic-reader', 'comics', this.handler, String(this.id)); // eslint-disable-line no-param-reassign
    mkdirp.sync(path);

    fs.writeFileSync(Path.join(path, 'data.json'), JSON.stringify({
      name: this.name,
      handler: this.handler,
      id: this.id,
      pageNumbers: this.pageNumbers,
      pages: this.pages,
    }));
  }

  loadFromData(data) {
    this.name = data.name;
    this.handler = data.handler;
    this.id = data.id;

    this.pageNumbers = data.pageNumbers;
    this.pages = data.pages.map(d => new Page().fromData(d));

    return this;
  }

  toPSObject() {
    return this.pages.map(p => ({
      src: p.url,
      w: p.width,
      h: p.height,
    }));
  }

  update(cb) {
    const self = this;
    plugins[this.handler].getComic(this.id, (data) => {
      self.loadFromData(data);
      self.saveToFile();
      cb();
    });
  }
}

module.exports = Comic;
