const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.string().min(1).max(Number.MAX_SAFE_INTEGER),
    name: Joi.string().required().min(3).max(30),
});
