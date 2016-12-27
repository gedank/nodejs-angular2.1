'use strict';

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // Get the default config
  var config = require('./default');
  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
