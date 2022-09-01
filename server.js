const express = require("express");

const dbConnect = require("./database/dbconnect");
const routes = require("./Routes");

const dotenv = require("dotenv");
dotenv.config();
const app = express();

const bodyParser = require("body-parser");

const init = async () => {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(bodyParser.urlencoded({ extended: false }));

    // Connect to MongoDB
    dbConnect();

    //home page
    app.get("/", (req, res) =>
      res.status(200).send("Server is Running on 4000✅✅✅") 
    );

    app.use("/api", await routes());

    // Listen Server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log("http://localhost:4000/");
    });
  } catch (error) {
    console.log(error);
  }
};


init();
