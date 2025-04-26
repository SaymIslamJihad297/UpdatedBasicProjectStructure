const Joi = require('joi');

module.exports.userSchemaValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().optional(),
})

module.exports.LoginFormValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})


module.exports.addListingSchemaValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
})

