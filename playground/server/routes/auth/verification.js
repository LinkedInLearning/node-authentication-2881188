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
      const user = await UserService.findById(req.params.userId);
      if (!user || user.verificationToken !== req.params.token) {
        req.session.messages.push({
          text: 'Invalid credentials provided!',
          type: 'danger',
        });
      } else {
        user.verified = true;
        await user.save();
        req.session.messages.push({
          text: 'You have been verified!',
          type: 'success',
        });
      }
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
