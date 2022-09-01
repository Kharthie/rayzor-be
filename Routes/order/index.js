const router = require("express").Router();
const reqHandler = require("../../middleware/reqValidator");
const schemas = require("../../middleware/reqValidator/schemas/reqSchema");
const Order = require("../../database/models/order.model");
const Razorpay = require("razorpay");


//Create Order SDK:
module.exports = async () => {
  router.post(
    "/createOrder",
    reqHandler(schemas.createOrder, "body"),
    async (req, res) => {
      try {
        var instance = new Razorpay({
          key_id: process.env.YOUR_KEY_ID,
          key_secret: process.env.YOUR_SECRET,    
        });

        const { amount, currency, receipt } = req.body;

        const neworder = new Order({ amount, currency, receipt });
        neworder.save();
        instance.orders.create(
          { amount, currency, receipt },
          async (err, order) => {
            if (!err) {
              await Order.updateOne(
                {amount},
                { $set: { "metadata.orderid": order.id } }
              );
              res.send(order);
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

  router.get("/get-razorpay-key", (req, res) => {
    res.send({
      key: process.env.YOUR_KEY_ID,
    });
  });

  router.get("/getOrders", async (req, res) => {
    try {
      const Orders = await Order.find();
      res.send(Orders)
    } catch (error) {
      console.log(error);
      throw error; 
    }
  });

  return router;
};
