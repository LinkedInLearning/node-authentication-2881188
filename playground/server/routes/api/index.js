const { Router } = require('express');

const router = Router();
const todolistRouter = require('./todolist');

module.exports = (params) => {
  router.post('/login', async (req, res, next) => {
    try {
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  router.get('/whoami', (req, res, next) => {
    return next('Not implemented!');
  });

  router.use('/todolist', todolistRouter(params));

  return router;
};
