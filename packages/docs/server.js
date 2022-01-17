const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    /**
     * If we need to parse additional URL requests we can do it here
     * const { pathname, query } = parsedUrl;
     */

    /**
     * We can serve static assets like service workes here
     *  if (pathname === '/a') {
     *  app.render(req, res, '/a', query)
     * } else if() {...}
     */

    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) {
      throw err;
    }

    console.log('> Ready on http://localhost:3000');
  });
});
