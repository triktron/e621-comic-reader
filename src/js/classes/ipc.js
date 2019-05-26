const ipc = require('node-ipc');

ipc.config.id = 'ComicViewer';
ipc.config.retry = 1500;
ipc.config.networkPort = 5727;


class IPCServe {
    constructor() {
        ipc.serveNet();
        ipc.server.start();
    }

    on(name, cb) {
      ipc.server.on(name, cb);
    }

    emit(name, data) {
      ipc.server.emit(name, data);
    }
}

class IPCConnect {
    constructor() {
        ipc.connectToNet("ComicViewer");
    }

    on(name, cb) {
      ipc.of[ipc.config.id].on(name, cb);
    }

    emit(name, data) {
      ipc.of[ipc.config.id].emit(name, data);
    }
}

module.exports.serve = IPCServe;
module.exports.connect = IPCConnect;
