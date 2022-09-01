const Joi = require('joi');

module.exports = (schema, property) => {
    return (req, res, next) => {
        var result = null;
        const languageCode = req.headers['language'];
        if (property == 'req') {
            const request = {
                params: req.params,
                body: req.body
            }
            result = schema.validate(request);
        } else {
            result = schema.validate(req[property]);
        }

        const { value, error } = result;
        const valid = error == null;
        if (!valid) {
            res.status(422).json({
                message: messages(languageCode).ErrorMessage.InvalidRequestJson,
                validationError: error.message,
                data: req.body
            });
        } else {
            next();
        }

    }
} 
