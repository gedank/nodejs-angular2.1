'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    express = require('./express'),
    mongoose = require('./mongoose');

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    var app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  var _this = this;
  _this.init(function (app, db, config) {
  	app.listen(config.port, config.host, function () {
  		var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
    	// console.log(config);
    	if (callback) callback(app, db, config);
    });
  });
};
