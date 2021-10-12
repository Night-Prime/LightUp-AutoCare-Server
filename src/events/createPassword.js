const EventEmitter = require('events');
require('dotenv').config();
const { sendMail, generateToken } = require('../utilities/packages');
const BASE_URL = 'https://light-up-auto-care.herokuapp.com';

class CreatePasswordEmitter extends EventEmitter {}

const createPasswordEmitter = new CreatePasswordEmitter();
createPasswordEmitter.on('createPassword', async function (request, user) {
    const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    });
    const emailContent = {
        from: process.env.outlookEmail, // sender address
        to: user.email,
        subject: `Update profile by creating password`,
        text: `Hi ${user.name}. \n Update your password for your account by clicking this link below. This link would be valid within the next 24hrs for updating your password.\n ${BASE_URL}/createPassword?password_token=${token}`,
    };
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
    await sendMail(transportPayload, emailContent).catch((error) => {
        console.error(error);
    });
});

module.exports = createPasswordEmitter;
