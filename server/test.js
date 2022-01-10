require('dotenv/config');
const search = require('youtube-search');

const opts = {
  maxResults: 10,
  key: process.env.YOUTUBE_API_KEY,
  type: 'video'
};
console.log(opts.key);
search('jsconf', opts, function (err, results) {
  if (err) return console.log(err);

  console.dir(results);
});
