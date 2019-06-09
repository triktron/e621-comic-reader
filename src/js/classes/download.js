const mkdirp = require('mkdirp');
const fs = require('fs');
const Path = require('path');

class DownloadManager {
  constructor(updateProgress) {
    this.download_queue = [];
    this.is_running = false;

    this.total = 0;
    this.done = 0;
    this.done_timeout = null;
    this.update_progress = updateProgress;
  }

  download(url, path) {
    if (fs.existsSync(path)) return;

    this.total += 1;
    this.download_queue.push({
      url,
      path,
    });

    if (!this.is_running) this.start();
  }

  progress() {
    return this.total === 0 ? 0 : this.done / this.total;
  }

  start() {
    const self = this;
    if (this.is_running) return;
    this.is_running = true;

    if (this.download_queue.length === 0) return this.is_running = false;

    // make sure the directory exists
    const current = this.download_queue.shift();
    mkdirp.sync(Path.dirname(current.path));

    // generate a tmp file in case the download fails
    var tmpPath = tmp.tmpNameSync();
    let file = fs.createWriteStream(tmpPath);

    // download the file to the tmp file
    var start_time = Date.now();
    got.stream(current.url).pipe(file);
    file.on('finish', function() {
      file.close(() => {
        // move the tmp file to it's place
        fs.rename(tmpPath, current.path, function (err) {
          if (err) return console.log(err);
          self.done++;
          self.update_progress();
          if (self.done_timeout) clearTimeout(self.done_timeout);
          self.done_timeout = setTimeout(() => {
            self.done = 0;
            self.total = 0;
            self.update_progress();
          },1200)

          // make sure it's been 500 ms since last call to not hit the api limit
          var time_past = Date.now() - start_time;
          self.is_running = false;
          if (time_past > 510) self.start(); else setTimeout(() => self.start(), 510 - time_past);
        })
      });
    });
  }
}

module.exports = DownloadManager;
