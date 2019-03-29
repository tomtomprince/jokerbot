'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

const slackLogLevel = 'debug';

const rtm = slackClient.init(process.env.SLACK_BOT_KEY, slackLogLevel);
rtm.start()
  .catch(console.error);

rtm.on('ready', () => {
    server.listen(3000);
});

server.on('listening', () => {
    console.log(`Joker Bot is listening on ${server.address().port} in ${service.get('env')} mode`);
});