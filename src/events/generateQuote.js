const EventEmitter = require('events');
const QuoteGenerator = require('../utilities/quoteGenerator');
const sendMailToClient = require('../utilities/quoteMailer');

class GenerateQuoteEmitter extends EventEmitter {}

const generateQuoteEmitter = new GenerateQuoteEmitter();
generateQuoteEmitter.on('createQuote', function (quote) {
    let ig = new QuoteGenerator(quote);

    void (async function main() {
        await ig.generate();
    })();
});

generateQuoteEmitter.on('createQuote', async function (quote) {
    await sendMailToClient(quote).catch((error) => {
        console.error(error);
    });
});

module.exports = generateQuoteEmitter;
