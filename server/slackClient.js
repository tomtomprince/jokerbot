'use strict';

const { RTMClient } = require('@slack/rtm-api');

const brianUserId = 'U5RPJQ1FY';
const tomUserId = 'U5R2JKMHB';
module.exports.init = function slackClient(token, logLevel) {
    const rtm = new RTMClient(token, {logLevel});
    
    rtm.on('user_typing', async (event) => {
        console.log(event);
        if(event.user === tomUserId) {
            const res = await rtm.sendMessage(`I see you typing Brian`, event.channel);
            console.log('message sent: ', res.ts);
        }
    });

    rtm.on('message', async (event) => {
        console.log(event);
        const {content, channel, subtitle} = event;
        const author = subtitle;
        await rtm.sendTyping(channel);
        // Send content to wai.ai
        await (new Promise((resolve) => setTimeout(resolve, 1000)));
        // Reply
        const res = await rtm.sendMessage(`Message Received`, channel);
        console.log('message sent: ', res.ts);
    });
    return rtm;
};