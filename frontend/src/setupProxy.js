const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Calendar and LLM routes go to calendar service (8080)
  app.use(
    ['/api/calendar', '/api/llm'],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy Calendar]', req.method, req.path, '->', 'http://localhost:8080' + req.path);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Calendar Error]', err);
      }
    })
  );

  // Auth routes go to authentication service (8081)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy Auth]', req.method, req.path, '->', 'http://localhost:8081' + req.path);
      },
      onError: (err, req, res) => {
        console.error('[Proxy Auth Error]', err);
      }
    })
  );
};
