const router = require("express").Router();
const reqHandler = require("../../middleware/reqValidator");
const schemas = require("../../middleware/reqValidator/schemas/reqSchema");
const Items = require("../../database/models/item.model");
const Razorpay = require("razorpay");

//Create Item SDK:
module.exports = async () => {
  router.post(
    "/CreateItem",
    reqHandler(schemas.createItem, "body"),
    async (req, res) => {
      try {
        var instance = new Razorpay({
          key_id: process.env.YOUR_KEY_ID,
          key_secret: process.env.YOUR_SECRET,
        });

        const { name, description, amount, currency } = req.body;

        const newitem = new Items({ name, description, amount, currency });
        newitem.save();
        instance.items.create(
          { name, description, amount, currency },
          async (err, item) => {
            if (!err) {
              await Items.updateOne(
                { name },
                { $set: { "metadata.itemId": item.id } }
              );
              res.send(item);
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
