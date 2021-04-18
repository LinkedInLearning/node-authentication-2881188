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
      const user = await UserService.findByUsername(req.body.username);
      if (!user) {
        errors.push('username');
        errors.push('password');
        req.session.messages.push({
          text: 'Invalid username or password!',
          type: 'danger',
        });
      } else {
        const isValid = await user.comparePassword(req.body.password);
        if (!isValid) {
          errors.push('username');
          errors.push('password');
          req.session.messages.push({
            text: 'Invalid username or password!',
            type: 'danger',
          });
        }
      }

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
      req.session.userId = user.id;
      req.session.messages.push({
        text: 'You are logged in now!',
        type: 'success',
      });
      if (req.body.remember) {
        req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 * 14;
        req.session.rememberme = req.sessionOptions.maxAge;
      } else {
        req.session.rememberme = null;
      }
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  });

  /**
   * GET route to log a user out
   * @todo: Implement
   */
  router.get('/logout', (req, res) => {
    req.session.userId = null;
    req.session.rememberme = null;
    req.session.messages.push({
      text: 'You are logged out now!',
      type: 'info',
    });
    return res.redirect('/');
  });

  return router;
};
