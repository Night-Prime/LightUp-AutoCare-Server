require('dotenv').config();
const { checkToken } = require('../utilities/packages');
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

const verifyToken = async (request, response, next) => {
    const bearerToken = request.headers['authorization'] || request.query.password_token;
    if (!bearerToken) {
        next(responseError);
    }
    await checkToken(bearerToken)
        .then((decoded) => {
            // Append the parameters to the request object
            request.id = decoded.id;
            request.token = bearerToken;
            request.role = decoded.role;
            request.name = decoded.name;
            next();
        })
        .catch((error) => {
            next(responseError);
        });
};

module.exports = { checkAccessRight, checkAdminAccess, verifyToken };
