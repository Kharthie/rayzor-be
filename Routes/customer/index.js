const router = require("express").Router();
const schemas = require("../../middleware/reqValidator/schemas/reqSchema");
const reqHandler = require("../../middleware/reqValidator");
const Customer = require("../../database/models/Customer.model");
const Razorpay = require("razorpay");

//Customer Razorpay SDK
module.exports = async () => {
  router.post(
    "/createCustomer",
    reqHandler(schemas.createCustomer, "body"),
    async (req, res) => {
      try {
        var instance = new Razorpay({
          key_id: process.env.YOUR_KEY_ID,
          key_secret: process.env.YOUR_SECRET,
        });

        const { name, email, contact } = req.body;

        const newcustomer = new Customer({ name, email, contact });
        newcustomer.save();
        instance.customers.create(
          { name, email, contact },
          async (err, customer) => {
            if (!err) {
              await Customer.updateOne(
                { name },
                { $set: { "metadata.customerId": customer.id } }
              );
              res.send(customer);
            } else {
              res.send(err);
            }
          }
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  );

  return router;
};
