console.log('[setupProxy] hello from setupProxy.js');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    console.log('[setupProxy] mounting /api proxy → http://localhost:5454');
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5454',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: { '^/api': '/api' }
        })
    );
};
