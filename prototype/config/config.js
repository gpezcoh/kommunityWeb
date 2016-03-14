var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'prototype'
    },
    port: 3000,
    db: 'mongodb://localhost/prototype-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'prototype'
    },
    port: 3000,
    db: 'mongodb://localhost/prototype-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'prototype'
    },
    port: process.env.PORT,
    db: 'mongodb://heroku_2v7v68mq:j0o1tu9n7tgmn09pe75rk5fts1@ds011298.mongolab.com:11298/heroku_2v7v68mq'
  }
};

module.exports = config[env];
