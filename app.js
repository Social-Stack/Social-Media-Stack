require('dotenv').config();
const cors = require('cors');
const path = require('path');
const http = require('http');
const chalk = require('chalk');

const express = require('express');
const app = express();
app.use(express.static('public'));

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json());

app.use(
  cors({
    origin: '*'
  })
);

app.use((req, res, next) => {
  console.log(chalk.whiteBright('<___Body Logger Start___>'));
  console.log(req.body);
  console.log(chalk.whiteBright('<___Body Logger End___>'));

  next();
});

const apiRouter = require('./api');
app.use('/api', apiRouter);

app.get('*', async (req, res, next) => {
  res.status(404);
  next({
    error: 'Page not found',
    message: 'The page you are looking for was not found'
  });
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.use((error, req, res, next) => {
  res.send({
    error: error.error,
    message: error.message
  });
});

const PORT = process.env['PORT'] ?? 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    chalk.blueBright('Server is listening on'),
    chalk.bold.yellowBright('PORT :', PORT),
    chalk.blueBright('.Concat with Social Stack!')
  );
});

module.exports = app;
