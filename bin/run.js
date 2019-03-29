'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

const slackToken = 'xoxb-194424426577-594312666919-lFw1CfRqrmodx5e6FagKJuwb';
const slackLogLevel = 'debug';

const rtm = slackClient.init(slackToken, slackLogLevel);
rtm.start()
  .catch(console.error);

rtm.on('ready', () => {
    server.listen(3000);
});

server.on('listening', () => {
    console.log(`Iris is listening on ${server.address().port} in ${service.get('env')} mode`);
});