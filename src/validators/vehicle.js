const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    vehicleName: Joi.string().required().min(3).max(30),
    clientId: Joi.number().required().min(1).max(Number.MAX_SAFE_INTEGER),
    model: Joi.string().required().min(3).max(30),
    chassis: Joi.string(),
});
