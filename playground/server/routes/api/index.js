const { Router } = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = Router();
const todolistRouter = require('./todolist');

module.exports = (params) => {
  const { config } = params;
  router.post(
    '/login',
    passport.authenticate('local', {
      session: false,
    }),
    async (req, res, next) => {
      try {
        const token = jwt.sign(
          {
            userId: req.user.id,
          },
          config.JWTSECRET,
          { expiresIn: '24h' }
        );
        return res.json({ jwt: token });
      } catch (err) {
        return next(err);
      }
    }
  );

  router.get('/whoami', (req, res, next) => {
    return next('Not implemented!');
  });

  router.use('/todolist', todolistRouter(params));

  return router;
};
