const router = require("express").Router();
const reqHandler = require("../../middleware/reqValidator/");
const schemas = require("../../middleware/reqValidator/schemas/reqSchema");
const Invoice = require("../../database/models/invoice.model");
const Razorpay = require("razorpay");

//Create Invoice SDK
module.exports = async () => {
  router.post(
    "/CreateInvoice",
    reqHandler(schemas.createInvoice, "body"),
    async (req, res) => {
      try {
        var instance = new Razorpay({
          key_id: process.env.YOUR_KEY_ID,
          key_secret: process.env.YOUR_SECRET,
        });
        const {
          type,
          date,
          customer_id,
          line_items: [{ item_id }],
        } = req.body;

        const newInvoice = new Invoice({
          type: "invoice",
          date: new Date(),
          customer_id,
          line_items: [{ item_id }],
        });

        newInvoice.save();
        instance.invoices.create(
          { type, date, customer_id, line_items: [{ item_id }] },

          async (err, invoice) => {
            if (!err) {
              await Invoice.updateOne(
                { customer_id },
                {
                  $set: {
                    "metadata.invoiceid": invoice.id,
                    "metadata.short_url": invoice.short_url,
                    "metadata.customer_details": invoice.customer_details,
                    "metadata.line_items": invoice.line_items,
                    "metadata.order_id": invoice.order_id,
                  },
                }
              );
              res.send(invoice);
            } else {
              res.send(err);
            }
          }
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  );

  return router;
};
