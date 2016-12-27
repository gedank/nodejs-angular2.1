'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  path = require('path'),
  mongoose = require('mongoose');

// Initialize Mongoose
module.exports.connect = function (cb) {
  var _this = this;
  var db = mongoose.connect(config.db.database, config.db.options, function (err) {
    // Log Error
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    } else {
      mongoose.Promise = config.db.promise;
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);
      // Call callback FN
      if (cb) cb(db);
    }
  });
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info('Disconnected from MongoDB.');
    cb(err);
  });
};
