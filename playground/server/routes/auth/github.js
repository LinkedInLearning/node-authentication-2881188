const { Router } = require('express');
const passport = require('passport');
const UserService = require('../../services/UserService');

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

  return router;
};
