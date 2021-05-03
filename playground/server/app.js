const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const path = require('path');

// We are using cookie based sessions
// http://expressjs.com/en/resources/middleware/cookie-session.html
const session = require('cookie-session');

// This is the root file of the routing structure
const indexRouter = require('./routes/index');
const setupPassport = require('./lib/passport');

// This is a simple helper that avoids 404 errors when
// the browser tried to look for a favicon file
function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    return res.status(204).end();
  }
  return next();
}

module.exports = (config) => {
  const app = express();
  const passport = setupPassport(config);
  // Just in case we need to log something later
  // const { logger } = config;

  // This is used to show the database connection status on the website
  app.locals.databaseStatus = config.database.status;

  // Set up views
  app.set('views', path.join(__dirname, 'views'));
  // view engine setup
  app.set('view engine', 'ejs');

  // Serving static assets like styles or images
  // Make sure to do this before initializing session management
  // to avoid overhead when just serving images
  app.use(express.static(path.join(__dirname, '../public')));

  // Initialize session management with cookie-session
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
      sameSite: 'lax',
      maxAge: null,
    })
  );

  // See express body parsers for more information
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * @todo: Implement a middleware that restores the user from the database if `userId` is present on the session
   */
  app.use(async (req, res, next) => {
    req.sessionOptions.maxAge =
      req.session.rememberme || req.sessionOptions.maxAge;
    res.locals.user = req.user;
    return next();
  });

  // This sets up 'flash messaging'
  // With that, we can store messages to the user in the session
  // and these messages will then be shown on the webpage and
  // deleted from the session once displayed.
  // Look into `/server/views/partials/messages.ejs`to see how this works.
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
