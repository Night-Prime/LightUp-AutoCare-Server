require('dotenv').config();

const { promisify } = require('util');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { SALT, secret_token } = process.env;

const signJWT = promisify(jwt.sign);

const verifyJWT = promisify(jwt.verify);

const _REQUEST = require('request');

const InvoiceGenerator = require('../utilities/invoiceGenerator');

async function hashObject(object) {
    const salt = await bcrypt.genSalt(Number(SALT));

    const hashedObject = await bcrypt.hash(object, salt);

    return hashedObject;
}

async function verifyObject(sentObject, dbObject) {
    const isMatch = await bcrypt.compare(sentObject, dbObject);

    return isMatch;
}

async function generateToken(payload) {
    const expiration = '24h';

    const token = await signJWT(payload, secret_token, { expiresIn: expiration });

    return token;
}

async function checkToken(token) {
    return await verifyJWT(token, secret_token);
}

async function doRequest(requestPayload) {
    return new Promise(function (resolve, reject) {
        _REQUEST(requestPayload, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}
async function createInvoice() {
    let ig = new InvoiceGenerator(payload);
    return await ig.generate();
}
module.exports = {
    hashObject,

    verifyObject,

    generateToken,

    checkToken,

    doRequest,
};
