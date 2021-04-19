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
          const user = await UserService.findByEmail(req.body.email);
          if (user) {
            // eslint-disable-next-line no-unused-vars
            const resetToken = await UserService.createPasswordResetToken(
              user.id
            );
          }
        }

        if (errors.length) {
          // Render the page again and show the errors
          return res.render('auth/resetpassword', {
            page: 'resetpassword',
            data: req.body,
            errors,
          });
        }

        req.session.messages.push({
          text:
            'If we found a matching user, you will receive a password reset link.',
          type: 'info',
        });
        /**
         * @todo: On success, redirect the user to some other page, like the login page
         */
        return res.redirect('/');
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
      const resetToken = await UserService.verifyPasswordResetToken(
        req.params.userId,
        req.params.resetToken
      );
      if (!resetToken) {
        req.session.messages.push({
          text: 'The provided token is invalid!',
          type: 'danger',
        });
        return res.redirect('/auth/resetpassword');
      }

      return res.render('auth/changepassword', {
        page: 'resetpassword',
        userId: req.params.userId,
        resetToken: req.params.resetToken,
      });
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
        const resetToken = await UserService.verifyPasswordResetToken(
          req.params.userId,
          req.params.resetToken
        );
        if (!resetToken) {
          req.session.messages.push({
            text: 'The provided token is invalid!',
            type: 'danger',
          });
          return res.redirect('/auth/resetpassword');
        }
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
        await UserService.changePassword(req.params.userId, req.body.password);
        await UserService.deletePasswordResetToken(req.params.resetToken);
        req.session.messages.push({
          text: 'Your password was successfully changed!',
          type: 'success',
        });
        return res.redirect('/auth/login');
      } catch (err) {
        return next(err);
      }
    }
  );

  return router;
};
