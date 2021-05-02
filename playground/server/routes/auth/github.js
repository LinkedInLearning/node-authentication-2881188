const { Router } = require('express');
const passport = require('passport');

const router = Router();

module.exports = () => {
  /**
   * GET route to initiate GitHub authentication flow
   * @todo: Implement
   */
  router.get('/', passport.authenticate('github'), async (req, res, next) => {
    try {
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  router.get(
    '/callback',
    passport.authenticate('github'),
    async (req, res, next) => {
      try {
        return next('Not implemented');
      } catch (err) {
        return next();
      }
    }
  );

  return router;
};
