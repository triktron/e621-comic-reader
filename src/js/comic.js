/* global PhotoSwipe, PhotoSwipeUI_Default */

const pswpElement = document.querySelectorAll('.pswp')[0];

const Comic = require('../js/classes/comic.js');

const hash = document.location.hash.substr(1).split('/');
const comic = new Comic();
comic.id = hash[0];
comic.handler = hash[1];
comic.loadFromFile();

const items = comic.toPSObject();

// modified lib to not close in source
const options = {
  loop: false,
  pinchToClose: false,
  closeOnScroll: false,
  closeOnVerticalDrag: false,
  escKey: false,
  history: false,
  index: 0, // start at first slide
  barsSize: { top: 0, bottom: 0 },
};

const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
gallery.init();

document.querySelector('.pswp__button--update').addEventListener('click', () => {
  alert('Starting comic update!');

  comic.update(() => {
    alert('Done updating.');

    location.reload();
  });
});
