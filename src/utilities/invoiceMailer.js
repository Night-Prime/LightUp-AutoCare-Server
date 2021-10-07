require('dotenv').config();
const fs = require('fs/promises');
const { sendMail } = require('../utilities/packages');

const transportPayload = {
    host: 'smtp-mail.outlook.com', // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers: 'SSLv3',
    },
    auth: {
        user: process.env.outlookEmail,
        pass: process.env.outlookEmailPassword,
    },
};
// const transportPayload = {
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//         user: process.env.testEmail,
//         pass: process.env.testEmailPassword,
//     },
// };

async function sendMailToClient(invoice, clientEmail) {
    const filePath = `./Invoice-${invoice.invoiceId}.pdf`;
    const emailContent = {
        from: process.env.outlookEmail, // sender address
        to: clientEmail,
        subject: `Invoice for ${invoice.vehicleName} ${invoice.model}`,
        text: 'We care about your safety',
        html: '<b>LightUp AutoCare</b>',
        attachments: [
            {
                filename: `Invoice-${invoice.invoiceId}.pdf`,
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
