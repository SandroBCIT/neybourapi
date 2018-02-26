const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./api/routes/posts");
// const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/users');

mongoose.connect(
    "mongodb://admin:bcitneybour@neybour-shard-00-00-hd6e2.mongodb.net:27017,neybour-shard-00-01-hd6e2.mongodb.net:27017,neybour-shard-00-02-hd6e2.mongodb.net:27017/test?ssl=true&replicaSet=neybour-shard-0&authSource=admin",
    {
        useMongoClient: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/posts", postRoutes);
// app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;