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
    let bearerToken;
    if (request.body.confirmPassword) {
        bearerToken = request.body.password_token;
    } else {
        bearerToken = request.headers['authorization'];
    }
    if (!bearerToken) {
        next(responseError);
    }
    console.log({
        bearerToken,
        body: request.body,
        request: request.headers['authorization'],
    });
    await checkToken(bearerToken)
        .then((decoded) => {
            // Append the parameters to the request object
            request.id = decoded.id;
            request.token = bearerToken;
            request.role = decoded.role;
            request.name = decoded.name;
            request.email = decoded.email;

            console.log(request.email);
            next();
        })
        .catch((error) => {
            next(responseError);
        });
};

module.exports = { checkAccessRight, checkAdminAccess, verifyToken };
