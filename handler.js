"use strict";
var createError = require("http-errors");
const express = require("express");
const serverless = require("serverless-http");
const env = require("dotenv/config");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");

const redis = require("./src/utils/redis");

const errLogger = require("./src/utils/errorLogger");
const reqLogger = require("./src/utils/requestLogger");

const indexRouter = require("./src/routes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
// Set view engine as EJS
app.engine("pug", require("ejs").renderFile);
app.set("view engine", "pug");

// redis.createRedis();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.use(reqLogger);
app.use("/", indexRouter);
// app.use(errLogger);

// app.set("view engine", "jade");

app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT, function () {
  console.log(`Server listening on port test ${process.env.PORT}`);
});

module.exports.handler = serverless(app);
