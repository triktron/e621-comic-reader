var pswpElement = document.querySelectorAll('.pswp')[0];

const Comic = require("../js/classes/comic.js");

var plugins = require("../js/classes/plugins/plugins.js")
plugins.E621(14921,data => {
  var a = new Comic().loadFromData(data);

  var items = a.toPSObject();
  
  // modified lib to not close in source
  var options = {
      loop: false,
      pinchToClose: false,
      closeOnScroll: false,
      closeOnVerticalDrag: false,
      escKey: false,
      history: false,
      index: 0, // start at first slide
      barsSize: {top:0, bottom:0},
  };

  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();

})
