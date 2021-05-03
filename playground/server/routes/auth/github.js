const { Router } = require('express');
const passport = require('passport');
const UserService = require('../../services/UserService');
const validation = require('../../middlewares/validation');

const router = Router();

module.exports = () => {
  /**
   * GET route to initiate GitHub authentication flow
   * @todo: Implement
   */
  router.get('/', passport.authenticate('github'));

  router.get(
    '/callback',
    passport.authenticate('github', {
      failureRedirect: '/auth/github/complete',
    }),
    async (req, res, next) => {
      try {
        req.session.messages.push({
          text: 'You are logged in via GitHub now!',
          type: 'success',
        });
        return res.redirect(req.session.returnTo || '/');
      } catch (err) {
        return next();
      }
    }
  );

  router.get('/complete', async (req, res, next) => {
    try {
      if (!req.session.tempOAuthProfile) {
        req.session.messages.push({
          text: 'Login via GitHub has failed',
          type: 'danger',
        });

        return res.redirect('/auth/login');
      }
      if (req.user) {
        const user = await UserService.findById(req.user.id);
        if (!user.oauthprofiles) {
          user.oauthprofiles = [];
        }
        user.oauthprofiles.push(req.session.tempOAuthProfile);
        await user.save();
        req.session.messages.push({
          text: 'Your GitHub profile was sucessfully linked!',
          type: 'success',
        });
        return res.redirect(req.session.returnTo || '/');
      }
      return res.render('auth/complete', { page: 'registration' });
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/complete',
    // Here we call middlewares to validate the user inputs
    validation.validateUsername,
    validation.validateEmail,
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
          return res.render('auth/complete', {
            page: 'registration',
            data: req.body,
            errors,
          });
        }

        /**
         * @todo: Provide a method in UserService that will create a new user
         */
        await UserService.createSocialUser(
          req.body.username,
          req.body.email,
          req.session.tempOAuthProfile
        );
        req.session.messages.push({
          text: 'Your account was created and linked with GitHub!',
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
