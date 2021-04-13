const { Router } = require('express');

const router = Router();

module.exports = () => {
  /**
   * GET route to initiate GitHub authentication flow
   * @todo: Implement
   */
  router.get('/', async (req, res, next) => {
    try {
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  /**
   * GET route that is used as a callback from github
   * @todo: Implement
   */
  router.get('/callback', async (req, res, next) => {
    try {
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
