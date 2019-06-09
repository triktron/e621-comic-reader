const got = require('got');

module.exports.getComic = function getE621Comic(id, cb, comic, p = 1) {
  comic = comic || { handler: 'e621', id }; // eslint-disable-line
  let pages = [];

  got(`https://e621.net/pool/show/${id}.json?page=${p}`).then(r => JSON.parse(r.body)).then((data) => {
    pages = data.posts.map(post => ({
      description: post.description,
      url: post.file_url,
      extra_data: {
        sources: post.sources,
        id: post.id,
      },
      width: post.width,
      height: post.height,
    }));
    comic.name = data.name; // eslint-disable-line no-param-reassign
    if (p === 1) {
      comic.pages = pages; // eslint-disable-line no-param-reassign
    } else {
      comic.pages = comic.pages.concat(pages); // eslint-disable-line no-param-reassign
    }
    p += 1; // eslint-disable-line no-param-reassign

    if (pages.length > 0) {
      setTimeout(() => module.exports.getComic(id, cb, comic, p), 500);
    } else cb(comic);
  });
};

module.exports.testUrl = function testUrl(url) {
  const reg = /https:\/\/e621.net\/pool\/show\/(\d+)/g;
  const res = reg.exec(url);

  if (res) return res[1];
  return null;
};
