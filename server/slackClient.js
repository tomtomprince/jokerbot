'use strict';

const { RTMClient } = require('@slack/rtm-api');

module.exports.init = function slackClient(token, logLevel) {
    const rtm = new RTMClient(token, {logLevel});
    
    rtm.on('user_typing', async (event) => {
        console.log(event);
        const res = await rtm.sendMessage(`I see you typing ${event.user}`, event.channel);
    
        // Log out a timestamp
        console.log('message sent: ', res.ts);
    });
    return rtm;
};