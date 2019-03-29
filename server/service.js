'use strict';

const express = require('express');
const service = express();


const { RTMClient } = require('@slack/rtm-api');

const rtm = new RTMClient('xoxb-194424426577-594312666919-lFw1CfRqrmodx5e6FagKJuwb');
rtm.start()
    .catch(console.error);

rtm.on('ready', async () => {
    console.log('rtm ready');
});

rtm.on('user_typing', async (event) => {
    console.log(event);
    const res = await rtm.sendMessage(`I see you typing ${event.user}`, event.channel);

    // Log out a timestamp
    console.log('message sent: ', res.ts);
});

module.exports = service;