require('dotenv').config();
const fs = require('fs/promises');
const nodemailer = require('nodemailer');

async function sendMailToClient(quote) {
    const filePath = `./Quote-${quote.id}.pdf`;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.testEmail,
            pass: process.env.testEmailPassword,
        },
    });

    // send mail with defined transport object
    await transporter
        .sendMail({
            from: process.env.email, // sender address
            to: process.env.email,
            subject: `Quote for ${quote.model}`,
            text: 'We care about your safety',
            html: '<b>LightUp AutoCare</b>',
            attachments: [
                {
                    filename: `Quote-${quote.id}.pdf`,
                    path: filePath,
                },
            ],
        })
        .then(() => {
            console.log('this should be success');
            await fs.unlink(filePath);
            console.log(`successfully deleted ${filePath}`);
        })
        .catch((error) => {
            console.error(error.message);
        });
}

module.exports = sendMailToClient;
