const { Router } = require('express');

// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
  /**
   * GET route that verifies a user by their token
   */
  router.get('/verify/:userId/:token', async (req, res, next) => {
    try {
      /**
       * @todo: Validate verification credentials and verify if valid
       */
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
