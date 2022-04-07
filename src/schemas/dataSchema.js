import joi from 'joi';

const dataSchema = joi.object({
    value: joi.number().positive().required(),
    description: joi.string().required(),
    type: joi.string().required(),
});

export default dataSchema;
