const express = require("express");
const app = express();
var cors = require("cors");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const emailRoutes = require("./routes/emails");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const session = require("express-session");
const userRoute = require("./routes/user");

dotenv.config();
app.use(cors({ origin: true, credentials: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api", emailRoutes);
app.use("/api/user/auth", authRoute);
app.use("/api/user", userRoute);

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to mongoose")
);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
