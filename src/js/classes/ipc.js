const ipc = require('node-ipc');

ipc.config.id = 'ComicViewer';
ipc.config.retry = 1500;
ipc.config.networkPort = 5727;


class IPCServe {
  constructor() {
    ipc.serveNet();
    ipc.server.start();
  }

  on(name, cb) { // eslint-disable-line class-methods-use-this
    ipc.server.on(name, cb);
  }

  emit(name, data) { // eslint-disable-line class-methods-use-this
    ipc.server.broadcast(name, data);
  }
}

class IPCConnect {
  constructor() {
    ipc.connectToNet('ComicViewer');
  }

  on(name, cb) { // eslint-disable-line class-methods-use-this
    ipc.of[ipc.config.id].on(name, cb);
  }

  emit(name, data) { // eslint-disable-line class-methods-use-this
    ipc.of[ipc.config.id].emit(name, data);
  }
}

module.exports.Serve = IPCServe;
module.exports.Connect = IPCConnect;
