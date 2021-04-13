const { Router } = require('express');

// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');
const validation = require('../../middlewares/validation');

const router = Router();

module.exports = () => {
  /**
   * GET route to display the login form
   */
  router.get('/resetpassword', (req, res) => {
    res.render('auth/resetpassword', { page: 'resetpassword' });
  });

  /**
   * POST route to create the password reset token
   */
  router.post(
    '/resetpassword',
    validation.validateEmail,
    async (req, res, next) => {
      try {
        const validationErrors = validation.validationResult(req);
        const errors = [];
        if (!validationErrors.isEmpty()) {
          validationErrors.errors.forEach((error) => {
            errors.push(error.param);
            req.session.messages.push({
              text: error.msg,
              type: 'danger',
            });
          });
        } else {
          /**
           * @todo: Find the user and create a reset token
           */
          return next('Not implemented!');
        }

        if (errors.length) {
          // Render the page again and show the errors
          return res.render('auth/resetpassword', {
            page: 'resetpassword',
            data: req.body,
            errors,
          });
        }

        /**
         * @todo: On success, redirect the user to some other page, like the login page
         */
        return next('Not implemented!');
      } catch (err) {
        return next(err);
      }
    }
  );

  /**
   * GET route to verify the reset token and show the form to change the password
   */
  router.get('/resetpassword/:userId/:resetToken', async (req, res, next) => {
    try {
      /**
       * @todo: Validate the token and render the password change form if valid
       */
      return next('Not implemented!');
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/resetpassword/:userId/:resetToken',
    validation.validatePassword,
    validation.validatePasswordMatch,
    async (req, res, next) => {
      try {
        /**
         * @todo: Validate the provided credentials
         */

        const validationErrors = validation.validationResult(req);
        const errors = [];
        if (!validationErrors.isEmpty()) {
          validationErrors.errors.forEach((error) => {
            errors.push(error.param);
            req.session.messages.push({
              text: error.msg,
              type: 'danger',
            });
          });
        }

        if (errors.length) {
          // Render the page again and show the errors
          return res.render('auth/changepassword', {
            page: 'resetpassword',
            data: req.body,
            userId: req.params.userId,
            resetToken: req.params.resetToken,
            errors,
          });
        }

        /**
         * @todo: Change password, remove token and redirect to login
         */
        return next('Not implemented!');
      } catch (err) {
        return next(err);
      }
    }
  );

  return router;
};
