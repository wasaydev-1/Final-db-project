const express = require("express");
const auth = express();
const database = require("../Database");

// ...

auth.post("/signup", (req, res) => {
  console.log("req body ", req.body);
  const { username = "", email = "", password = "" } = req.body;

  console.log("here");
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  database.connection.getConnection((err, connection) => {
    if (err) {
      console.log("database error");
      return res.status(500).json({ isError: true, data: err });
    }

    connection.query(
      "INSERT INTO users (id , username, email, password) VALUES (?, ?, ? , ?)",
      [Date.now(), username, email, password],
      (error) => {
        connection.release();

        if (error) {
          console.log(error);
          return res.status(500).json({ isError: true, data: error });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

auth.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  database.connection.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ isError: true, data: err });
    }

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, results) => {
        connection.release();

        if (error) {
          return res.status(500).json({ isError: true, data: error });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];
        console.log("user  ", user);
        console.log("password ", password);
        if (password === user.Password) {
          // Passwords match, user is authenticated
          // You can generate a token here if needed

          res.status(200).json({ user });
        } else {
          res.status(401).json({ error: "Invalid email or password" });
        }
      }
    );
  });
});

module.exports = auth;
