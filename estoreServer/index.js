const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const product = require("./Routes/product");
const auth = require("./Routes/signup");
const addToCart = require("./Routes/addToCart");
const orders = require("./Routes/orders");
app.use("/product/api/", product);
app.use("/auth/api/", auth);
app.use("/api/add-to-cart", addToCart);
app.use("/api/orders", orders);
app.use("/", express.static("Uploads"));

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log("App is running on port - " + PORT);
});
