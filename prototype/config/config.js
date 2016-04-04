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
    db: process.env.MONGOLAB_URI
  }
};

module.exports = config[env];
