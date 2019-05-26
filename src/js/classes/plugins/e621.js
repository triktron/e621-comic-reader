const got = require('got');

module.exports = function getE621Comic(id, cb, comic, p = 1) {
  comic = comic || {};
  var pages = [];

  got("https://e621.net/pool/show/" + id + ".json?page=" + p).then((r) => JSON.parse(r.body)).then(data => {
      pages = data.posts.map(post => {
        return {
          description: post.description,
          url: post.file_url,
          extra_data: {
            sources: post.sources,
            id:post.id,
          },
          width: post.width,
          height: post.height
        }
      })
      comic.name = data.name;
      if (p == 1) comic.pages = pages; else comic.pages = comic.pages.concat(pages);
      p++;

    if (pages.length > 0) setTimeout(() => module.exports(id, cb, comic, p),500); else cb(comic);
  })
}
