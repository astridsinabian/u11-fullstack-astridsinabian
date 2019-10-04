const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = {
        username: Joi.string().min(6).required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).required(),
        description: Joi.string().max(400),
        admin: Joi.string()
    };
    return Joi.validate(data, schema);
}

const loginValidation = (data) => {
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().required()
    };
    return Joi.validate(data, schema);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
