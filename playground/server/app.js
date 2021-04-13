const cookieParser = require('cookie-parser');
const express = require('express');

// We are using cookie based sessions http://expressjs.com/en/resources/middleware/cookie-session.html
const session = require('cookie-session');

const httpErrors = require('http-errors');
const path = require('path');

const indexRouter = require('./routes/index');

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    return res.status(204).end();
  }
  return next();
}

module.exports = (config) => {
  const app = express();
  // eslint-disable-next-line no-unused-vars
  const { logger } = config;
  app.locals.databaseStatus = config.database.status;
  app.set('views', path.join(__dirname, 'views'));
  // view engine setup
  app.set('view engine', 'ejs');

  // Serving static assets like styles or images
  app.use(express.static(path.join(__dirname, '../public')));

  // Initialize session management
  app.use(
    session({
      name: 'session',
      keys: [
        'a set',
        'of keys',
        'used',
        'to encrypt',
        'the session',
        'change in',
        'production',
      ],
      resave: false,
      saveUninitialized: true,
      sameSite: 'strict',
      maxAge: null,
    })
  );

  // See express body parsers for more information
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  /**
   * @todo: Implement a middleware that restores the user from the database if `userId` is present on the session
   */

  app.use(async (req, res, next) => {
    res.locals.user = req.user;
    return next();
  });

  // Define 'global' template variables here
  app.use(async (req, res, next) => {
    // Set up flash messaging
    if (!req.session.messages) {
      req.session.messages = [];
    }
    res.locals.messages = req.session.messages;
    return next();
  });

  // Note that we are calling the index router as a function
  app.use('/', indexRouter({ config }));

  // Avoid 404 errors because of a missing favicon
  app.use(ignoreFavicon);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(httpErrors(404));
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};
