function checkAccessRight (request, response, next) {
    if (request.role === 'admin' || request.role === 'approver') {
        next()
    } else {
        const error = {
            status: 401,
            error: "Requires admin or approver privilege",
            payload: null
        }
        next(error);
    }
}

module.exports = checkAccessRight;