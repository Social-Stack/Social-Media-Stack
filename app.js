require("dotenv").config();
const client = require("./db/client");
const cors = require("cors");
const path = require("path");
const http = require("http");
const chalk = require("chalk");

// const favicon = require("serve-favicon");

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  console.log(chalk.whiteBright("<___Body Logger Start___>"));
  console.log(chalk.greenBright.bgWhiteBright(req.body));
  console.log(chalk.whiteBright("<___Body Logger End___>"));

  next();
});

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use((error, req, res, next) => {
  res.send({
    error: error.error,
    message: error.message,
  });
});

app.get("*", async (req, res) => {
  res.status(404).send({
    error: "Page not found",
    message: "The page you are looking for was not found",
  });
});

client.connect();
const PORT = process.env["PORT"] ?? 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    chalk.blueBright("Server is listening on"),
    chalk.bold.yellowBright("PORT :", PORT),
    chalk.blueBright(".Concat with Social Stack!")
  );
});
