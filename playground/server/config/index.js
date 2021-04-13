const logger = require('pino')({ prettyPrint: true });
require('dotenv').config();

module.exports = {
  database: {
    dsn: 'mongodb://localhost:37017/linkedin-node-authentication',
    status: {
      connected: false,
      error: false,
    },
  },
  JWTSECRET: process.env.JWTSECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  logger,
};
