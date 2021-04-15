#!/usr/bin/env node

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const http = require('http');
const config = require('../config');

const { logger } = config;

const app = require('../app')(config);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Connect to mongodb and start the webserver listening on provided port, on all network interfaces.
 */

mongoose
  .connect(config.database.dsn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    config.database.status.connected = true;
    logger.info('Connected to MongoDB');
    server.listen(port);
  })
  .catch((error) => {
    config.database.status.error = error;
    logger.fatal(error);
    server.listen(port);
  });

/**
 * Event listener for HTTP server "error" event.
 */
/* eslint no-console: 0 */
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.fatal(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.fatal(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

/**
 * Event listener for HTTP server "listening" event.
 */

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
});
