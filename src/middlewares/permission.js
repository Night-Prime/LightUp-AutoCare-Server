require('dotenv').config();
const QuoteService = require('../services/quote/quote');
let isUserApproved = QuoteService.isApproved;

const jwt = require('jsonwebtoken');
const responseError = {
    status: 401,
    error: 'Invalid Token or No token provided in authorization header',
    payload: null,
};

function checkAccessRight(request, response, next) {
    if (request.role === 'admin' || request.role === 'approver') {
        next();
    } else {
        const error = {
            status: 401,
            error: 'Requires admin or approver privilege',
            payload: null,
        };
        next(error);
    }
}

function checkAdminAccess(request, response, next) {
    if (request.role === 'admin') {
        next();
    } else {
        const error = {
            status: 401,
            error: 'Requires only admin privilege',
            payload: null,
        };
        next(error);
    }
}

const verifyToken = (request, response, next) => {
    const bearerToken = request.headers['authorization'];

    if (!bearerToken) {
        next(responseError);
    }
    jwt.verify(bearerToken, process.env.secret_token, (error, decoded) => {
        if (error) {
            next(responseError);
        } else {
            // Append the parameters to the request object
            request.id = decoded.id;
            request.token = bearerToken;
            request.role = decoded.role;
            next();
        }
    });
};

module.exports = { checkAccessRight, checkAdminAccess, verifyToken };
