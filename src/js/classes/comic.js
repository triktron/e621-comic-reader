const fs = require('fs');

class Comic {
  constructor() {

  }

  loadFromFile(path) {
    var data = JSON.parse(fs.readFileSync(path));

    return this.loadFromData(data);
  }

  loadFromData(data) {
    this.name = data.name;

    this.pageNumbers = data.pageNumbers;
    this.pages = data.pages.map(d => new Page().fromData(d))

    return this;
  }

  toPSObject() {
    return this.pages.map(p => {return {
        src: p.url,
        w: p.width,
        h: p.height
    }});
  }
}

class Page {
  constructor() {

  }

  fromData(data) {
    this.url = data.url;
    this.width = data.width;
    this.height = data.height;

    return this;
  }
}


module.exports = Comic;
