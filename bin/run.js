'use strict';
require('dotenv').config();

const http = require('http');

const service = require('../server/service');
const slackClient = require('../server/slack-client');
const witClient = require('../server/wit-client');

const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;

const messageProcessor = witClient.init({
  shouldLog: isDevelopment,
  token: process.env.WIT_TOKEN,
});

const rtm = slackClient.init({
  messageProcessor,
  shouldLog: isDevelopment,
  token: process.env.SLACK_BOT_KEY, 
});

const startServer = () => {
  const server = http.createServer(service);
  const listenMessage = `Joker Bot is listening on ${port} in ${process.env.NODE_ENV} mode`;
  server.listen(3000, () => console.log(listenMessage));
};

rtm.start()
  .then(startServer)
  .catch(console.error);