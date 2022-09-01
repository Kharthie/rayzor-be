const express = require("express");

const initOrderRoute = require("./order");
const initCustomerRoute = require("./customer");
const initItemRoute = require("./item");
const initInvoicesRoute = require("./invoice");

module.exports = async () => {
  const orderRoute = await initOrderRoute();
  const customerRoute = await initCustomerRoute();
  const itemRoute = await initItemRoute();
  const invoiceRoute = await initInvoicesRoute();

  const router = new express.Router();

  router.get("/ping", async (req, res) =>
    res.json({
      message: "pong",
    })
  );

  router.use(orderRoute);
  router.use(customerRoute);
  router.use(itemRoute);
  router.use(invoiceRoute);

  return router;
};
