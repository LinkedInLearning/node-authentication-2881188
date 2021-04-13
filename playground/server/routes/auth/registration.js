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
   * POST route to process the registration form or display it again along with an error message in case validation fails
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
          // This block checks if the user already exists (username and/or email) and creates an error if so

          /**
           * @todo: Provide a method in UserService tries to find a user by email
           */
          return next('Not implemented!');
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

        // On success, redirect the user to the index page so that the form
        // can not be sent again by hitting 'refresh' on the browser
        return next('Not implemented!');
      } catch (err) {
        return next(err);
      }
    }
  );

  return router;
};
