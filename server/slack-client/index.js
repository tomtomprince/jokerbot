'use strict';
require('dotenv').config();

const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');
const joker = require('../joker');

const { Message } = require('../message');

function createUserMessage({userInfo, messageAnalysis, text}) {
    const userMessage = Object.create(Message);
    userMessage.analysis = messageAnalysis;
    userMessage.authorName = userInfo.user.profile.first_name;
    userMessage.text = text;
    return userMessage;
}

module.exports.init = function slackClient({
    messageProcessor,
    shouldLog,
    token, 
}) {
    const logLevel = shouldLog ? 'debug' : null;

    const rtm = new RTMClient(token, {logLevel});
    const web = new WebClient(token);

    rtm.on('message', async (event) => {
        const {text, channel, user} = event;
        
        // Only respond to messages addressing bot.
        // TODO: Get bot id dynamically
        if(!text || !text.includes('UHG96KLT1')) {
            return;
        }

        rtm.sendTyping(channel);
        const userInfo = await web.users.info({ user });
        const messageAnalysis = await messageProcessor.process(text);
        const userMessage = createUserMessage({userInfo, messageAnalysis, text});
        let responseText = joker.getResponse(userMessage);

        if(responseText) {
            rtm.sendMessage(responseText, channel);
        }
    });
    
    return rtm;
};