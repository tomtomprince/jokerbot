const {INTENTS} = require('./intents/constants');

function getResponse(message) {
    let intentService = null;
    try {
        intentService = require(`./intents/${message.analysis.intent}`);
    } catch (error) {
        intentService = require(`./intents/${INTENTS.UNKNOWN}`);
    }

    return intentService.getResponse(message);
}

module.exports = {
    getResponse
};