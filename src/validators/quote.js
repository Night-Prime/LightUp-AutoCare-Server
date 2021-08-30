const Joi = require('@hapi/joi');
const { required } = require('./client');

module.exports = Joi.object({
    id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    clientId: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    vehicleId: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    items: Joi.array().items(
        Joi.object({
            item: Joi.string(),
            unit: Joi.number().required(),
            rate: Joi.number().min(1).max(5),
            amount: Joi.number().required().min(1),
        })
    ),
    isPending: Joi.boolean(),
    isPending: Joi.boolean(),
});
