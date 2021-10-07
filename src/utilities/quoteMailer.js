require('dotenv').config();
const fs = require('fs/promises');
const nodemailer = require('nodemailer');

async function sendMailToClient(quote, clientEmail) {
    const filePath = `./Quote-${quote.quoteId}.pdf`;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: 'smtp.mailtrap.io',
        // port: 2525,
        // auth: {
        //     user: process.env.testEmail,
        //     pass: process.env.testEmailPassword,
        // },

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
    });

    // send mail with defined transport object
    await transporter
        .sendMail({
            from: process.env.outlookEmail, // sender address
            to: clientEmail,
            subject: `Quote for ${quote.model} ${quote.vehicleName}`,
            text: 'We care about your safety',
            html: '<b>LightUp AutoCare</b>',
            attachments: [
                {
                    filename: `Quote-${quote.quoteId}.pdf`,
                    path: filePath,
                },
            ],
        })
        .then(async () => {
            await fs.unlink(filePath);
            console.log(`successfully deleted ${filePath}`);
        })
        .catch((error) => {
            console.error(error.message);
        });
}

module.exports = sendMailToClient;
