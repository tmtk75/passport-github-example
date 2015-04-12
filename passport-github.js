var express        = require('express'),
    passport       = require('passport')
    GitHubStrategy = require('passport-github').Strategy,
    jade           = require("jade"),
    assets         = require("connect-assets"),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    logger         = require("morgan"),
    cookieParser   = require("cookie-parser"),
    cookieSession  = require("cookie-session"),
    path           = require("path");

passport.use(new GitHubStrategy({
    clientID:     process.env['GITHUB_CLIENT_ID'],
    clientSecret: process.env['GITHUB_CLIENT_SECRET'],
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(arguments);
    process.nextTick(function() {
      done(null, profile);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var app = express();
app.set('port', (process.env.PORT || 3000));
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "jade");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({keys: ['adf19dfe1a4bbdd949326870e3997d799b758b9b']}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(function(req, res, next) {
  res.locals.session = req.session
  next()
});
app.use('/public', express.static(__dirname + "/public"));
app.use('/assets', express.static(__dirname + "/assets"));
app.use(function(req, res, next) {
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { req.text += chunk; });
    req.on('end', next);
  } else {
    next();
  }
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res) {
    // never called becase of redirect to github
  });

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/', function (req, res) {
  res.redirect('/index.html')
});

app.get('/index.html', function (req, res) {
  res.render("index");
});

app.listen(3000);
