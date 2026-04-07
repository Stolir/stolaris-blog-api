require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
require("./config/passport");

// Require express related
const express = require("express");
const path = require("node:path");

// Require auth related
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Require routes
const registerRouter = require("./routes/registerRouter");
const authRouter = require("./routes/authRouter");
const authorRouter = require("./routes/authorRouter");
const articleRouter = require("./routes/articleRouter");

// Define app related
const app = express();
const PORT = process.env.PORT || 3000;

// Use general middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
// app.use(() => {
//   console.log("Received request");
// });

// Use routes
app.use("/api/register", registerRouter);
app.use("/auth", authRouter);
app.use("/api/author", authorRouter);
app.use("/api/articles", articleRouter);
// Generic not found route
app.use((req, res, next) => {
  return res.status(404).json({ message: "Page not found" });
});
// Error-catching route
app.use((err, req, res, next) => {
  console.error(err); // always log the full error server side

  // prisma not found error
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }

  // prisma unique constraint violation
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Resource already exists" });
  }

  // development — send full error details
  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({ message: err.message, stack: err.stack });
  }

  // production — generic message
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Running on port ${PORT}`);
});
