const IPC = require('../js/classes/ipc.js');
const Handler = require('../js/classes/handler.js');
const Comic = require('../js/classes/comic.js');

const ipc = new IPC.Connect();

document.querySelector('button[data-add-comic]').addEventListener('click', () => ipc.emit('add_tab'));
document.querySelector('button[data-theme-toggle]').addEventListener('click', () => ipc.emit('switch_theme'));

ipc.on('switch_theme_light', () => {
  document.body.classList.remove('dark');
});

ipc.on('switch_theme_dark', () => {
  document.body.classList.add('dark');
});

const handler = new Handler();

let txt = '';

for (var i in handler.comics) { // eslint-disable-line
  txt += `<div class="comic" index-id="${i}"><img src="${handler.comics[i].cover}" alt=""><div class="title"><marquee scrollamount="5" behavior="scroll" direction="left">${handler.comics[i].name}</marquee></div></div>`;
}

document.querySelector('.comics').innerHTML = txt;

document.querySelectorAll('.comic').forEach((c) => {
  c.addEventListener('click', () => {
    ipc.emit('open_comic', handler.comics[c.getAttribute('index-id')]);
  });
});

document.querySelector('#dialog .button.positive').addEventListener('click', () => {
  const url = document.querySelector('.add_comic_url').value;

  const c = new Comic();

  c.loadFromUrl(url, (err) => {
    if (!err) {
      c.saveToFile();
      location.reload();
    }
  });
});
