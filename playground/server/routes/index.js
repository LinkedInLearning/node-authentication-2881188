const { Router } = require('express');

const { ensureLoggedIn } = require('connect-ensure-login');

const cors = require('cors');
const authRouter = require('./auth');
const apiRouter = require('./api');
const playgroundRouter = require('./playground');

const router = Router();

// This module returns a function and this allows you to pass parameters down the routing chain
module.exports = (params) => {
  /* GET index page. */
  router.get('/', (req, res) => {
    res.render('index', { page: 'index' });
  });

  router.get('/myaccount', ensureLoggedIn('/auth/login'), (req, res) => {
    res.render('myaccount', { page: 'myaccount' });
  });

  // This delegates everything under /auth to the respective routing module.
  // We also pass down the params.
  router.use('/auth', authRouter(params));
  router.use('/playground', playgroundRouter(params));

  // Note the CORS middleware here - this is needed as we are calling the APi from a different URL/port
  router.use('/api', cors(), apiRouter(params));

  // Always return the router from such a module.
  return router;
};
