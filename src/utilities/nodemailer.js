require('dotenv').config();
const nodemailer = require('nodemailer');

// async function sendMailToClient(request, response, next) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.email,
//             pass: process.env.emailPassword,
//         },
//     });

//     const mailOptions = {
//         from: process.env.email,
//         to: 'myfriend@yahoo.com',
//         subject: `Vehicle Invoice`,
//         text: 'That was easy!',
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

async function sendMailToClient(invoice) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    return await transporter.sendMail({
        from: 'layitheinfotechguru@gmail.com', // sender address
        to: 'layitheinfotechguru@gmail.com',
        subject: `Invoice for ${invoice.model}`,
        text: 'We care about your safety',
        html: '<b>LightUp AutoCare</b>',
        attachments: [
            {
                filename: `Invoice-${this.invoice.id}.pdf`,
                path: __dirname + `/Invoice-${this.invoice.id}.pdf`,
            },
        ],
    });
}

module.exports = sendMailToClient;
