const EventEmitter = require('events');
const { sendMail } = require('../utilities/packages');

class CreatePasswordEmitter extends EventEmitter {}

const createPasswordEmitter = new CreatePasswordEmitter();
createPasswordEmitter.on('createPassword', async function (request, user) {
    const emailContent = {
        from: process.env.email, // sender address
        to: user.email,
        subject: `Update profile by creating password`,
        text: `Hi ${user.name}. \n Update your password for your account by clicking this link below.\n https://${request.hostname}${request.baseUrl}/createPassword?email=${user.email} `,
        html: '<b>LightUp AutoCare</b>',
    };
    const transportPayload = {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.testEmail,
            pass: process.env.testEmailPassword,
        },
    };
    await sendMail(transportPayload, emailContent).catch((error) => {
        console.error(error);
    });
});

module.exports = createPasswordEmitter;
