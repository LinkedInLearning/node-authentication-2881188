const { Router } = require('express');

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
    req.logout();
    return next('Not implemented!');
  });

  return router;
};
