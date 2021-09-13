const EventEmitter = require('events');
const InvoiceGenerator = require('../utilities/invoiceGenerator');
const sendMailToClient = require('../utilities/invoiceMailer');

class GenerateInvoiceEmitter extends EventEmitter {}

const generateInvoiceEmitter = new GenerateInvoiceEmitter();
generateInvoiceEmitter.on('createInvoice', function (invoice, _clientEmail) {
    let ig = new InvoiceGenerator(invoice);

    void (async function main() {
        await ig.generate();
    })();
});

generateInvoiceEmitter.on('createInvoice', async function (invoice, clientEmail) {
    await sendMailToClient(invoice, clientEmail).catch((error) => {
        console.error(error);
    });
});

module.exports = generateInvoiceEmitter;
