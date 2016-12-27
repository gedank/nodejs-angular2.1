'use strict';

module.exports = {
  app: {
    title: 'APP BETA',
    description: 'mongodb, express, angularjs, node.js, mongoose',
    keywords: 'mongodb, express, angularjs, node.js, mongoose'
  },
  db: {
    promise: global.Promise,
    database: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/mean-dev',
    options: {
      user: '',
      pass: ''
    },
    debug: process.env.MONGODB_DEBUG || false
  },
  port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
  host: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  server: {
    routes: ['modules/index/server/routes/index.js','modules/user/server/routes/api-user.js']
  }
};