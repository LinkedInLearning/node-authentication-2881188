const { Router } = require('express');

// eslint-disable-next-line no-unused-vars
const UserService = require('../../services/UserService');

const validation = require('../../middlewares/validation');

const router = Router();

module.exports = () => {
  /**
   * GET route to display the registration form
   */
  router.get('/register', (req, res) => {
    res.render('auth/registration', { page: 'registration' });
  });

  /**
   * POST route to process the registration form or display
   * it again along with an error message in case validation fails
   */
  router.post(
    '/register',
    // Here we call middlewares to validate the user inputs
    validation.validateUsername,
    validation.validateEmail,
    validation.validatePassword,
    validation.validatePasswordMatch,
    async (req, res, next) => {
      try {
        // This block deals with processing the validation input
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
          const existingEmail = await UserService.findByEmail(req.body.email);
          const existingUsername = await UserService.findByUsername(
            req.body.username
          );

          if (existingEmail || existingUsername) {
            errors.push('email');
            errors.push('username');
            req.session.messages.push({
              text: 'The given email address or the username exist already!',
              type: 'danger',
            });
          }
        }

        // If there was an error, we will render the form again and display the errors
        // We also pass in the previous user input so the user does not have to enter everything again
        if (errors.length) {
          // Render the page again and show the errors
          return res.render('auth/registration', {
            page: 'registration',
            data: req.body,
            errors,
          });
        }

        /**
         * @todo: Provide a method in UserService that will create a new user
         */
        await UserService.createUser(
          req.body.username,
          req.body.email,
          req.body.password
        );
        req.session.messages.push({
          text: 'Your account was created!',
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
