//process.env.NODE_ENV = 'dev';
//process.env.PORT = '3080';
var dotenv = require('dotenv').config();
var express = require('express');
var path = require('path');
var url = require('url');
var cors = require('cors');
var device = require('express-device');
var session = require('express-session');
var logger = require('./lib/logger');
var passport = require('passport');
var fs = require('fs');
var config = require('config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

mongoose.Promise = Promise;
// Connect to the db
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.mongoDBConnection, {useNewUrlParser: true}, function(error, db) {
  if(!error) {
    logger.info('We are connected MONGODB.');
  } else {
    logger.error('Unable to connect MONGODB:', error);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(device.capture({parseUserAgent: true}));

// ---Begin Swagger ---//
var swagger = require('swagger-node-express').createNew(app);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('dist'));

swagger.configureSwaggerPaths('', 'api-docs', '');
var domain = 'localhost';
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');
// ---End Swagger ---//

app.set('env', 'development');

var jsonParser = bodyParser.json({limit: '150mb'});
var urlencodedParser = bodyParser.urlencoded({
    extended: false, limit: '150mb', parameterLimit: 50000
});
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());

app.use(session({
    secret: 'my_secret_key',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'config')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// --- Start of Code for Handling Uncaught Exceptions
process.on('uncaughtException', function(error) {
  logger.error('Un Caught Exception:', error);
});
// --- End of Code for Handling Uncaught Exceptions

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, token, otp_token');

  // Response headers you wish to Expose
  res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With, content-type, token, otp_token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.disable('etag');

require('./config/passport')(passport);

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function(file) {
  if (file.substr(-3) == '.js') {
      require('./controllers/' + file).controller(app, passport);
  }
});

module.exports = app;
