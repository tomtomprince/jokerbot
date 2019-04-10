'use strict';
//#region DEPENDENCIES
const { Wit, log } = require('node-wit');
const { INTENTS, SENTIMENTS } = require('../intents/constants.js');
const { MessageAnalysis } = require('../message');
//#endregion

let client = null;

// ADD WIT_TO_SENTIMENTS and WIT_TO_INTENTS map
async function process(messageText) {
    const witResponse = await client.message(messageText.toLowerCase(), {});
    /** @type MessageAnalysis */
    const messageAnalysis = Object.create(MessageAnalysis);
    messageAnalysis.intent = getIntent(witResponse.entities);
    const witSentiment = witResponse.entities && witResponse.entities.sentiment;
    messageAnalysis.sentiment = getSentiment(witSentiment);
    return messageAnalysis;
}

// This is a bug... neutral can have high confidence I believe
// This means that a confident neutral will return as positive
// Instead get most confident value and if it's a certain amount
// return the result from SENTIMENTS
// otherwise return SENTIMENTS.NEUTRAL
function getSentiment(sentiment) {
    if(sentiment && sentiment[0].confidence > 0.7) {
        return sentiment[0].value === 'negative' ? SENTIMENTS.NEGATIVE : SENTIMENTS.POSITIVE;
    }
    
    return SENTIMENTS.NEUTRAL;
}

// This is dumb... 
// Write a generic method to find most confident item in an entity array (this will work for both custom and wit entities)
// Use that to find the most confident wit entity
// If there isn't one above a certain threshold, find the most confident entity from intents array
// Otherwise return unknown
function getIntent(witEntities) {
    if(isGreeting(witEntities)) {
        return INTENTS.GREETING;
    }

    if(isBye(witEntities)) {
        return INTENTS.BYE;
    }

    // Find most confident intent

    // If nothing return unknown
    return INTENTS.UNKNOWN;
}

function isGreeting(witEntities = {}) {
    return Array.isArray(witEntities.greetings) && witEntities.greetings[0].confidence > 0.8;
}

function isBye(witEntities = {}) {
    return Array.isArray(witEntities.bye) && witEntities.bye[0].confidence > 0.8;
}

module.exports.init = function witClient({token, shouldLog}) {
    
    client = new Wit({
        accessToken: token,
        logger: shouldLog ? new log.Logger(log.DEBUG) : null
    });

    return {
        process
    };
};