const FCLogin = require('./login');

const config = {
  port: 8080,
  appId: 'xxx',
  appSecret: 'xxx',
  redirectUri: 'http://127.0.0.1:8080/callback/',
  apiUrl: '/',
  callbackUrl: '/callback/',
};

new FCLogin(config);
