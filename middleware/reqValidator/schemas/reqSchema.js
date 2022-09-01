const Joi = require("joi");

const schemas = {
  createOrder: Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    receipt: Joi.string().required(),
  }),

  createCustomer: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string(),
    contact: Joi.string().required(),
  }),

  createItem: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    amount: Joi.string().required(),
    currency: Joi.string().required(),
  }),

  createInvoice: Joi.object({
    type: Joi.string(),
    date: Joi.number(),
    customer_id: Joi.string().required(),
    line_items: Joi.array()
      .required()
      .items(
        Joi.object().required().keys({
          item_id: Joi.string(),
        })
      ),
  }),
};

module.exports = schemas;
