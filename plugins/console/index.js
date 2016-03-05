'use strict';
/* global __dirname */

const _       = require('lodash');
const Vision  = require('vision');
const async   = require('async');
const Pages   = require('./pages');
const handlebars = require('handlebars');

const pageTitle = 'Relay Console'
var relayState = {
  relay1: false,
  relay2: false
}

function relayPage(request, reply) {
  Pages.relayPage(request, reply, {
    relayState: relayState,
    pageTitle: pageTitle
  });
}

function relayToggle(request, reply) {
  const key = _.keys(request.payload)[0]
  const keyState = request.payload[key] == true ? true : false;
  relayState[key] = keyState;
  
  reply.redirect('/');
}

function consolePlugin(server, options, next) {
  async.auto({
    vision: (callback) => {
      server.register(Vision, (error) => {
        callback(error);
      });
    }
  }, (error, results) => {
    if (error) {
      return next(error);
    }

  })
  server.register(Vision, (error) => {
    if (error) {
      next(error);
    }

    server.views({
      engines: {
        html: handlebars
      },
      relativeTo: __dirname,
      path: './views',
      isCached: false,
      layoutPath: './views/layout',
      layout: true
    });

    server.route([{
      method: 'GET',
      path: '/',
      handler: relayPage
    },
    {
      method: 'POST',
      path: '/relaytoggle',
      handler: relayToggle
    }]);

    next();
  });
}

exports.register = consolePlugin;
exports.register.attributes = {
  name: 'relay-console'
}