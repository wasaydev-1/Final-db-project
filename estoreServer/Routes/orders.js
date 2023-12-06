// orders.js

const express = require("express");
const orders = express();
const database = require("../Database");

// Endpoint to fetch user orders with product details
orders.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await fetchUserOrders(userId);
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => ({
        ...order,
        items: await fetchOrderItems(order.order_id),
      }))
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ isError: true, data: error });
  }
});

// Function to fetch user orders
const fetchUserOrders = (userId) => {
  return new Promise((resolve, reject) => {
    database.connection.query(
      "SELECT * FROM Orders WHERE user_id = ? ORDER BY order_date DESC",
      [userId],
      (error, orders) => {
        if (error) {
          reject(error);
        } else {
          resolve(orders);
        }
      }
    );
  });
};

// Function to fetch order items by order ID
const fetchOrderItems = (orderId) => {
  return new Promise((resolve, reject) => {
    database.connection.query(
      "SELECT oi.product_id, p.productname, oi.quantity ,oi.total_price FROM OrderItem oi JOIN Products p ON oi.product_id = p.id WHERE oi.order_id = ?",
      [orderId],
      (error, orderItems) => {
        if (error) {
          reject(error);
        } else {
          resolve(orderItems);
        }
      }
    );
  });
};

module.exports = orders;
