const { Router } = require('express');
const UserService = require('../../services/UserService');

const router = Router();

// This module returns a function and this allows you to pass parameters down the routing chain

// eslint-disable-next-line no-unused-vars
module.exports = (params) => {
  /* GET index page. */
  router.get('/userlist', async (req, res, next) => {
    try {
      const users = await UserService.getList();
      const userList = await Promise.all(
        users.map(async (user) => {
          const userJson = user.toJSON();
          const resetToken = await UserService.getResetToken(user.id);
          if (resetToken && resetToken.token) {
            userJson.resetToken = resetToken.token;
          }
          return userJson;
        })
      );

      return res.render('playground/userlist', {
        page: 'userlist',
        users: userList,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/userlist/delete/:id', async (req, res, next) => {
    try {
      await UserService.deleteUser(req.params.id);

      req.session.messages.push({
        text: 'The user was deleted',
        type: 'info',
      });

      return res.redirect('/playground/userlist');
    } catch (err) {
      return next(err);
    }
  });

  router.get(
    '/userlist/unlinksocial/:provider/:profileId',
    async (req, res, next) => {
      try {
        const user = await UserService.findByOAuthProfile(
          req.params.provider,
          req.params.profileId
        );
        user.oauthprofiles = [];
        await user.save();
        req.session.messages.push({
          text: 'GitHub was unlinked',
          type: 'info',
        });

        return res.redirect('/playground/userlist');
      } catch (err) {
        return next(err);
      }
    }
  );

  // Always return the router from such a module.
  return router;
};
