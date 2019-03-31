/**
 * @param {Message} message 
 * @return {string}
 */
function getResponse(message) {
    return `Response from unknown for "${message.text}"`;
}

module.exports = {
    getResponse
};