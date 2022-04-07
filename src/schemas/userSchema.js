import joi from 'joi';

const userSchema = joi.object({
    name: joi.string().alphanum().min(3).max(30).required(),
    password: joi
        .string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
});

export default userSchema;
