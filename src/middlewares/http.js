/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */
const { logger } = require('../utilities/logger');

module.exports = {
    handle404(request, response, next) {
        const returnData = {
            status: 404,
            error: 'Resource not found',
            payload: null,
        };

        next(returnData);
    },

    handleError(error, request, response, next) {
        // Log errors
        logger.error(error.error || error.message);

        // return error
        return response.status(error.status || 500).json({
            status: error.status || 500,
            error: error.error || 'Internal Server Error',
            payload: null,
        });
    },

    processResponse(request, response, next) {
        if (!request.payload) return next();
        const { status } = request.payload;
        return response.status(status).json(request.payload);
    },

    setupRequest(request, response, next) {
        request.headers['access-control-allow-origin'] = '*';
        request.headers['access-control-allow-headers'] = '*';

        if (request.method === 'OPTIONS') {
            request.headers['access-control-allow-methods'] = 'GET, POST, PUT, PATCH, DELETE';
            response.status(200).json();
        }

        next();
    },
};
