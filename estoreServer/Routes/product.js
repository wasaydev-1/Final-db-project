const express = require("express");
const product = express();
const database = require("../Database");

product.get("/getCategories", (req, res) => {
  let appData = {
    isError: false,
    data: [],
  };
  database.connection.getConnection((err, connection) => {
    if (err) {
      appData.isError = true;
      appData.data = err;
      res.status(500).json(appData);
    } else {
      connection.query("Select * from categories", (error, rows) => {
        if (error) {
          appData.isError = true;
          appData.data = err;
          res.status(500).json(appData);
        } else {
          appData.data = rows;
          res.status(200).json(appData);
        }
      });
      connection.release();
    }
  });
});

product.get("/getProducts", (req, res) => {
  let appData = {
    isError: false,
    data: [],
  };
  database.connection.getConnection((err, connection) => {
    if (err) {
      appData.isError = true;
      appData.data = err;
      console.log("prodcuts ", err);
      res.status(500).json(appData);
    } else {
      connection.query("Select * from products", (error, rows) => {
        if (error) {
          console.log("prodcuts query", error);

          appData.isError = true;
          appData.data = err;
          res.status(500).json(appData);
        } else {
          console.log("rows ", rows);
          appData.data = rows;
          res.status(200).json(appData);
        }
      });
      connection.release();
    }
  });
});

module.exports = product;
