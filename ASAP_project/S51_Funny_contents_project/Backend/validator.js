const Joi = require('joi');

const PostAndUpdateValidator = (data) => {
    const schema = Joi.object({
        content: Joi.string().required(),
        userID: Joi.string().required(),
        username: Joi.string().min(3).required(),
        age: Joi.number().integer().min(0).required(),
        country: Joi.string().required()
    });
    return schema.validate(data);
};

const AuthValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        country: Joi.string().required(),
        age: Joi.number().integer().min(0).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports = {
    PostAndUpdateValidator,
    AuthValidator
};
