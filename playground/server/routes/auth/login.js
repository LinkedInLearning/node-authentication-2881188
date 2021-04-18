const { Router } = require('express');
// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
  /**
   * GET route to display the login form
   */
  router.get('/login', (req, res) => {
    res.render('auth/login', { page: 'login' });
  });

  /**
   * POST route to process the login form or display it again along with an error message in case validation fails
   */
  router.post('/login', async (req, res, next) => {
    try {
      const errors = [];
      /**
       * @todo: Try to find the user in the database and try to validate the password
       */

      if (errors.length) {
        // Render the page again and show the errors
        return res.render('auth/login', {
          page: 'login',
          data: req.body,
          errors,
        });
      }
      /**
       * @todo: Log the user in by saving the userid to the session and redirect to the index page
       * @todo: Don't forget about 'Remember me'!
       */
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  /**
   * GET route to log a user out
   * @todo: Implement
   */
  router.get('/logout', (req, res, next) => {
    return next('Not implemented!');
  });

  return router;
};
