require('dotenv').config();
const fs = require('fs/promises');
const { sendMail } = require('../utilities/packages');

async function sendMailToClient(invoice, clientEmail) {
    const filePath = `./Invoice-${invoice.id}.pdf`;
    const transportPayload = {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.testEmail,
            pass: process.env.testEmailPassword,
        },
    };

    const emailContent = {
        from: process.env.email, // sender address
        to: clientEmail,
        subject: `Invoice for ${invoice.model}`,
        text: 'We care about your safety',
        html: '<b>LightUp AutoCare</b>',
        attachments: [
            {
                filename: `Invoice-${invoice.id}.pdf`,
                path: filePath,
            },
        ],
    };
    sendMail(transportPayload, emailContent)
        .then(async () => {
            await fs.unlink(filePath);
            console.log(`successfully deleted ${filePath}`);
        })
        .catch((error) => {
            console.error(error.message);
        });
}

module.exports = sendMailToClient;
