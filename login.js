const express = require('express');
const request = require('request');

const app = express();

module.exports = class FCLogin {
  constructor({ port, appId, appSecret, redirectUri, apiUrl, callbackUrl }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.redirectUri = redirectUri;
    this.codeUrl =
      'https://www.facebook.com/v2.9/dialog/oauth?' +
      `client_id=${appId}` +
      `&redirect_uri=${redirectUri}`;
    this.init(apiUrl, callbackUrl);
    this.listen(port);
  }

  init(apiUrl, callbackUrl) {
    app.get(apiUrl, (req, res) => {
      res.redirect(this.codeUrl);
    });

    app.get(callbackUrl, (req, res) => {
      const code = req.query.code;
      this.tokenUrl = 'https://graph.facebook.com/v2.9/oauth/access_token?' +
        `client_id=${this.appId}` +
        `&redirect_uri=${this.redirectUri}` +
        `&client_secret=${this.appSecret}` +
        `&code=${code}`;
      this.getToken(this.tokenUrl, res);
    });
  }

  getToken(tokenUrl, res) {
    request.get(tokenUrl, (err, response, body) => {
      this.accessToken = JSON.parse(body).access_token;
      const fields = 'id,name,gender,picture';
      this.profileUrl = `https://graph.facebook.com/me?fields=${fields}&access_token=${this.accessToken}`;
      this.getProfile(this.profileUrl, res);
    });
  }

  getProfile(profileUrl, res) {
    request.get(profileUrl, (err, response, body) => {
      if (err) throw err;
      res.send(body);
    });
  }

  listen(port) {
    app.listen(port, () => {
      console.log(port, ' listening!');
    });
  }
};
