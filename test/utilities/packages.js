require('dotenv').config();
const { expect } = require('chai');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const proxyquire = require('proxyquire');
const packages = require('../../src/utilities/packages');
// describe('Test external packages', () => {
//     // it('hash password', function () {
//     //     var Password = 'password';
//     //     var expectedResponse = '';
//     //     var result = packages.hashObject(Password);
//     //     expect(result).to.be.equal(expectedResponse);
//     // });
//     it('should hash password', () => {
//         let stub = sinon.stub(packages, 'hashObject');
//         stub.withArgs('password')
//             .onFirstCall()
//             .returns('hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh')
//             .onSecondCall()
//             .returns('jfkfjkjhfdjiyu4878475rhgfjh48yr89n');
//         expect(stub('password')).to.be.equal('hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh');
//         expect(stub('password')).to.be.equal('jfkfjkjhfdjiyu4878475rhgfjh48yr89n');
//         stub.restore();
//     });

//     it('should verifyObject password that is correct', () => {
//         let stub = sinon.stub(packages, 'verifyObject');
//         stub.withArgs('password', 'hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh').returns(true);
//         expect(stub('password', 'hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh')).to.be.equal(true);
//         stub.restore();
//     });

//     it('should verifyObject password that is incorrect', () => {
//         let stub = sinon.stub(packages, 'verifyObject');
//         stub.withArgs('password', 'hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh').returns(true);
//         expect(stub('passwo', 'hfjdfnhkerwjkjfkjgkhjfkgkfjgkj7465435782ufjh')).to.not.be.equal(
//             true
//         );
//     });

//     it('should should generate token', () => {
//         let stub = sinon.stub(packages, 'generateToken');
//         const payload = {
//             id: 1,
//             email: 'test@example.com',
//             role: 'admin',
//             name: 'John Doe',
//         };
//         stub.withArgs(payload).returns(
//             'jgufhgirijuiruirujkjfnvnbjfsjnw87347y54990fngjghvhhvbwj230irijvnvjgfiruti9u'
//         );
//         expect(stub(payload)).to.be.equal(
//             'jgufhgirijuiruirujkjfnvnbjfsjnw87347y54990fngjghvhhvbwj230irijvnvjgfiruti9u'
//         );
//     });
//     it('should verify correct token', () => {
//         let stub = sinon.stub(packages, 'checkToken');
//         const token = 'jghghruhgihrijhgifjgirj49ur598498t579305r5ogjrijgniofhgoefdo9ertuivj';
//         const payload = {
//             id: 1,
//             email: 'test@example.com',
//             role: 'admin',
//             name: 'John Doe',
//         };
//         stub.withArgs(token).returns(payload);
//         expect(stub(token)).to.be.equal(payload);
//         stub.restore();
//     });
//     it('should verify incorrect token', () => {
//         let stub = sinon.stub(packages, 'checkToken');
//         const token = 'jghghruhgihrijhgifjgirj49ur598498t579305r5ogjrijgniofhgoefdo9ertuivj';
//         const invalidToken = 'jghgngjifskjgvkjgkgjkjg';
//         const payload = {
//             id: 1,
//             email: 'test@example.com',
//             role: 'admin',
//             name: 'John Doe',
//         };
//         stub.withArgs(token).returns(payload);
//         expect(stub(invalidToken)).to.not.be.equal(payload);
//     });
//     it('should send mail', () => {
//         let stub = sinon.stub(packages, 'sendMail');
//         const transportPayload = {
//             host: 'smtp.mailtrap.io',
//             port: 2525,
//             auth: {
//                 user: process.env.testEmail,
//                 pass: process.env.testEmailPassword,
//             },
//         };
//         const emailContent = {
//             from: process.env.email,
//             to: 'client@example.com',
//             subject: `Sample subject written here`,
//             text: 'Sample text written here',
//             html: '<b>Lorem Ipsum</b>',
//         };

//         stub.withArgs(transportPayload, emailContent).returns({
//             messageId: '<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>',
//         });
//         expect(stub(transportPayload, emailContent)).to.have.property('messageId');
//         stub.restore();
//     });
//     it('should not send mail', () => {
//         let stub = sinon.stub(packages, 'sendMail');
//         const transportPayload = {
//             host: 'smtp.mailtrap.io',
//             port: 2525,
//             auth: {
//                 user: process.env.testEmail,
//                 pass: process.env.testEmailPassword,
//             },
//         };
//         const emailContent = {
//             from: process.env.email,
//             to: '',
//             subject: `Sample subject written here`,
//             text: 'Sample text written here',
//             html: '<b>Lorem Ipsum</b>',
//         };

//         stub.withArgs(transportPayload, emailContent).returns({
//             error: {
//                 message: 'Error message',
//             },
//         });
//         expect(stub(transportPayload, emailContent)).to.have.property('error');
//     });
// });

describe('bcrypt Tests', async () => {
    const { hashObject, verifyObject } = packages;
    let Password = '1234';
    let crptPassword = await hashObject(Password);

    it('test the hashObject() create new hash password to the input password', () => {
        expect(crptPassword).to.not.be.equal(Password);
    });

    it('test the verifyObject() check if return true when its compare and false when its not', async () => {
        const correctPassword = await verifyObject(Password, crptPassword);
        expect(correctPassword).to.be.equal(true);
        expect(await verifyObject(Password, crptPassword)).to.be.a('boolean');
    });
});

describe('JWT tests', async () => {
    const payload = {
        id: 1,
        email: 'test@example.com',
        role: 'admin',
        name: 'John Doe',
    };
    const { generateToken, checkToken } = packages;
    const generatedToken = await generateToken(payload);
    const decoded = await checkToken(generatedToken);

    it('test the generated token to be a string', () => {
        expect(generatedToken).to.be.a('string');
    });
    it('test the generated token should be different from payload', () => {
        expect(generatedToken).to.not.equal(payload);
    });
    it('test the decoded value to check if it has properties of payload', () => {
        expect(decoded).to.haveOwnProperty('id');
        expect(decoded).to.haveOwnProperty('email');
        expect(decoded).to.haveOwnProperty('role');
        expect(decoded).to.haveOwnProperty('name');
    });

    it('test the decoded property to have new properties added iat and exp', () => {
        expect(decoded).to.haveOwnProperty('exp');
        expect(decoded).to.haveOwnProperty('iat');
    });
});

describe('Date Format test', () => {
    const { modifyDateFormat } = packages;
    it('test the date should be different from Date.now() format to a string type', () => {
        const now = new Date();
        const formattedDate = modifyDateFormat(now);
        expect(formattedDate).to.not.equal(now);
        expect(modifyDateFormat(now)).to.be.a('string');
    });
});

describe('Nodemailer Test', () => {
    const transportPayload = {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.testEmail,
            pass: process.env.testEmailPassword,
        },
    };
    const emailContent = {
        from: process.env.email,
        to: 'client@example.com',
        subject: `Sample subject written here`,
        text: 'Sample text written here',
        html: '<b>Lorem Ipsum</b>',
    };

    it('should mock sending mail to user', async (done) => {
        sinon.stub(nodemailer.createTransport, 'sendMail').returns({ message_id: '23' });
        // sinon.stub(nodemailer, 'createTransport').returns({
        //     transporter: {
        //         sendMail: () => {
        //             message_id: 'test';
        //         },
        //     },
        // });
        let result = await packages.sendMail(transportPayload, emailContent);
        //console.log('r', result);
        // done();
        //   expect.deepEqual(nodeMailerMock.createTransport.getCall(0).args, [transportPayload]);
        //  expect.deepEqual(nodeMailerMock.createTransport.sendMail.getCall(0).args, [emailContent]);
    });
});
