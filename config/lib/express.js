'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var session = require('express-session');
var expressValidator = require('express-validator');

var engine = require('consolidate');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname , '../../assets')));
  app.use(express.static(path.join(__dirname , '../../modules')));
  app.use(express.static(path.join(__dirname , '../../template')));
  app.use(expressValidator());
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app, config) {
  // Globbing routing files
  config.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app, config);
  });
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  app.set('views', path.join(__dirname, '../../template'));
  app.engine('html', engine.mustache);
  app.set('view engine', 'html');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app) {
  app.use(session({
    secret:"rahasia12345",
    proxy: true,
    resave: true,
    saveUninitialized: true
  }));
};


module.exports.initError = function (app) {
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use(function(err, req, res, next) {
    if (!err) {
      return next();
    }
    console.error(err.stack);
    res.redirect('/serror');
  });
};


/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();
  this.initMiddleware(app);
  this.initSession(app);
  this.initViewEngine(app);
  this.initLocalVariables(app);
  this.initModulesServerRoutes(app, config);
  this.initError(app);

  return app;
};
