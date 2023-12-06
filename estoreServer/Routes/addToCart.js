const express = require("express");
const addToCart = express();
const database = require("../Database");

addToCart.post("/", (req, res) => {
  const { userId, products } = req.body;
  console.log("userid", userId);
  console.log("products ", products);
  // Validate request data
  if (!userId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      isError: true,
      data: "Invalid request data. Please provide userId and a non-empty array of products.",
    });
  }

  let appData = {
    isError: false,
    data: [],
  };

  database.connection.getConnection((err, connection) => {
    if (err) {
      appData.isError = true;
      appData.data = err;
      console.log("err ", err);
      res.status(500).json(appData);
    } else {
      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          appData.isError = true;
          appData.data = transactionErr;
          console.log("transaction error ", transactionErr);
          res.status(500).json(appData);
          connection.release();
        } else {
          // Insert order data into the Orders table
          const orderData = {
            user_id: userId,
            total_amount: 0, // You can calculate the total amount based on products
          };

          connection.query(
            "INSERT INTO Orders SET ?",
            orderData,
            (orderError, orderResult) => {
              if (orderError) {
                console.log("order error ", orderError);
                return connection.rollback(() => {
                  appData.isError = true;
                  appData.data = orderError;
                  res.status(500).json(appData);
                  connection.release();
                });
              }
              console.log("orderData ", orderData);
              const orderId = orderResult.insertId;

              // Create an array of order item data objects
              const orderItemDataArray = products.map((product) => [
                orderId,
                product.productId,
                product.quantity,
                product.quantity * product.price, // Assuming each product has a 'price' property
              ]);

              // Insert order item data into the OrderItem table
              connection.query(
                "INSERT INTO OrderItem (order_id, product_id, quantity, total_price) VALUES ?",
                [orderItemDataArray],
                (orderItemError, orderItemResult) => {
                  if (orderItemError) {
                    console.log(orderItemError);
                    return connection.rollback(() => {
                      appData.isError = true;
                      appData.data = orderItemError;
                      res.status(500).json(appData);
                      connection.release();
                    });
                  }

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.log(commitErr);
                      return connection.rollback(() => {
                        appData.isError = true;
                        appData.data = commitErr;
                        res.status(500).json(appData);
                        connection.release();
                      });
                    }

                    appData.data = orderItemResult;
                    res.status(200).json(appData);
                    connection.release();
                  });
                }
              );
            }
          );
        }
      });
    }
  });
});

module.exports = addToCart;
