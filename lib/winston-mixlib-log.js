/*
 * winston-mixlib-log.js: Transport for outputting in the Mixlib Log format
 *
 * (C) 2012 Josh Toft
 * MIT LICENSE
 *
 */

var util = require('util');
var winston = require('winston');
var common = require('winston/lib/winston/common');
var Stream = require('stream').Stream;

//
// ### function MixlibLog (options)
// Constructor for the MixlibLog transport objct.
//
var MixlibLog = exports.MixlibLog = function (options) {
  options = options || {};

  var self = this;

  this.name = 'mixlib-log';
};

//
// Inherit from `winston.Transport`.
//
util.inherits(MixlibLog, winston.Transport);

//
// Define a getter so that `winston.transports.MixlibLog`
// is available and thus backwrds compatible.
//
winston.transports.MixlibLog = MixlibLog;

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
MixlibLog.prototype.log = function (level, msg, meta, callback) {
  var self = this;

  
};

