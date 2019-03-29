'use strict';
require('dotenv').config();

const { RTMClient } = require('@slack/rtm-api');
const { WebClient, ErrorCode } = require('@slack/web-api');

const brianUserId = 'U5RPJQ1FY';
const tomUserId = 'U5R2JKMHB';

const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: process.env.WIT_TOKEN,
  logger: new log.Logger(log.DEBUG) // optional
});

module.exports.init = function slackClient(token, logLevel) {
    const rtm = new RTMClient(token, {logLevel});
    const web = new WebClient(token);

    rtm.on('message', async (event) => {
        const {text, channel, user} = event;
        await rtm.sendTyping(channel);
        // Send content to wai.ai
        const witResponse = await client.message(text.toLowerCase(), {});
        const userInfo = await web.users.info({ user });
        const userFirstName = userInfo.user.profile.first_name;
        console.log('user', userInfo.user);
        let responseText = null;
        if(witResponse.entities.greetings && witResponse.entities.greetings[0].confidence > 0.8) {
            responseText = `Hello ${userFirstName}`;
        }

        if(witResponse.entities.bye && witResponse.entities.bye[0].confidence > 0.8) {
            responseText = `Goodbye ${userFirstName}`;
        }

        if(witResponse.entities.intent && witResponse.entities.intent[0].confidence > 0.6 && witResponse.entities.intent[0].value === 'insult') {
            responseText = `Well, that's not nice, ${userFirstName}.`;
        }

        if(!responseText && witResponse.entities.sentiment && witResponse.entities.sentiment[0].confidence > 0.7 && witResponse.entities.sentiment[0].value === 'negative') {
            responseText = `I hear you. Sometimes life is hard`;
        }

        if(!responseText && witResponse.entities.sentiment && witResponse.entities.sentiment[0].confidence > 0.7 && witResponse.entities.sentiment[0].value === 'positive') {
            responseText = `I'm glad you're having a good day. Fuck you.`;
        }

        // Reply
        if(responseText) {
            const res = await rtm.sendMessage(responseText, channel);
            console.log('message sent: ', res.ts);
        }
    });
    return rtm;
};