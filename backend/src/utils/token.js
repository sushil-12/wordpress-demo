// token.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('./cred.json');

// Replace with the code you received from Google
const code = '4/0AeaYSHCbvgGA_7iEu7G6_o1oQcVK0eJ7jLy4FkkiZzZbOM7Z6CneprSvntTgLtHJQsPRcg';
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(__dirname, 'token.json');
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});