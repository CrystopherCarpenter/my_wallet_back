import joi from 'joi';

const signinSchema = joi.object({
    password: joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
});

export default signinSchema;
