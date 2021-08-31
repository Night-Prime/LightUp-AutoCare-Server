const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    clientId: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    vehicleId: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    items: Joi.array().items(
        Joi.object({
            item: Joi.string().required().min(3).max(30),
            unit: Joi.string().required().min(1).max(Number.MAX_SAFE_INTEGER),
            rate: Joi.string().required().min(1).max(Number.MAX_SAFE_INTEGER),
            unit: Joi.string().required().min(1).max(Number.MAX_SAFE_INTEGER),
        })
    ),
});
