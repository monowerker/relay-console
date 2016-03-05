/* global process */
'use strict';

const fs = require('fs')
const async = require('async');
const Hapi = require('hapi');
const Good = require('good');
const ConsoleLogger = require('good-console');
const ConsolePlugin = require('./plugins/console');

async.auto({
  key: (callback) => {
    fs.readFile('./keys/key.pem', (error, data) => {
      callback(error, data);
    });
  },
  cert: (callback) => {
    fs.readFile('./keys/cert.pem', (error, data) => {
      callback(error, data);
    });
  },
  server: ['key', 'cert', (callback, results) => {
    const server = new Hapi.Server();
    const tlsOpts = {
      key: results.key,
      cert: results.cert
    };

    server.connection({
      port: process.env.PORT || 8888,
      tls: tlsOpts,
      autoListen: true
    });

    callback(null, server);
  }],
  registerLoggingPlugin: ['server', (callback, results) => {
    results.server.register({
      register: Good,
      options: {
        reporters: [{
          reporter: ConsoleLogger,
          events: {
            response: '*',
            log: '*'
          }
        }]
      }
    }, (error) => {
      callback(error);
    });
  }],
  registerConsolePlugin: ['server', (callback, results) => {
    results.server.register(ConsolePlugin, (err) => {
      callback(err);
    });
  }],
  start: ['server', (callback, results) => {
    results.server.start((error) => {
      callback(error);
    });
  }]
}, (error, results) => {
  if (error) {
    throw error;
  }

  console.log('Server running at:', results.server.info.uri);
});