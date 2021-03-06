export default function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.send(validation.error).status(400);
        }

        next();
    };
}
