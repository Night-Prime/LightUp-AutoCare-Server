const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    clientId: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    vehicleId: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    vehicleName: Joi.string(),
    clientName: Joi.string(),
    items: Joi.array().items(
        Joi.object({
            item: Joi.string(),
            unit: Joi.number().required(),
            rate: Joi.number(),
            amount: Joi.number().required().min(1),
        })
    ),
    isPending: Joi.boolean(),
    isPending: Joi.boolean(),
});
