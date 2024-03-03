// token.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('./cred.json');

// Replace with the code you received from Google
const code = '4/0AeaYSHAuKveYKXFj6S3MEqxuYiZ-OZaTsnHuJLx2ryh6xMwt5zQTFcf_9fDBp9_EHoS9sw';
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(__dirname, 'token.json');
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});