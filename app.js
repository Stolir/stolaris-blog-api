require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
require("./config/passport");

// Require express related
const express = require("express");
const path = require("node:path");

// Require auth related
const passport = require("passport");

// Require routes
const registerRouter = require("./routes/registerRouter");
const authRouter = require("./routes/authRouter");
const authorRouter = require("./routes/authorRouter");

// Define app related
const app = express();
const PORT = process.env.PORT || 3000;

// Use general middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
// ...

// Use routes
app.use("/api/register", registerRouter);
app.use("/auth", authRouter);
app.use("/api/author", authorRouter);
// Generic not found route
// Error-catching route

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Running on port ${PORT}`);
});
