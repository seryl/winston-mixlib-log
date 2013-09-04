/*
 * winston-mixlib-log.js: Transport for outputting in the Mixlib Log format
 *
 * (C) 2012 Josh Toft
 * MIT LICENSE
 *
 */

var util = require('util'),
    cycle = require('cycle'),
    winston = require('winston'),
    common = require('winston/lib/winston/common'),
    config = require('winston/lib/winston/config'),
    Transport = require('winston/lib/winston/transports/transport').Transport;

//
// ### function MixlibLog (options)
// Constructor for the MixlibLog transport objct.
//
var MixlibLog = exports.MixlibLog = function (options) {
  Transport.call(this, options);
  options = options || {};

  this.name        = 'mixlib-log';
  this.json        = options.json        || false;
  this.colorize    = options.colorize    || false;
  this.prettyPrint = options.prettyPrint || false;
  this.timestamp   = typeof options.timestamp !== 'undefined' ? options.timestamp : false;

  if (this.json) {
    this.stringify = options.stringify || function (obj) {
      return JSON.stringify(obj, null, 2);
    };
  }
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
// ### function timestamp ()
// Returns a timestamp string for the current time.
//
exports.timestamp = function() {
  function zeropad(num, padding) {
    var zero = padding - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  };

  function get_offset_string(time) {
    var ostring = ''.concat(zeropad(Math.abs(time), 2), ':00');
    if (time > 0) {
      return ''.concat('-', ostring);
    } else {
      return ''.concat('+', ostring);
    }
  };
  
  var date = new Date();
  var utc_date = new Date(date - (date.getTimezoneOffset() * 60000));
  var offset = date.getTimezoneOffset()/60;
  return "".concat(
    date.getUTCFullYear(), '-',
    zeropad(date.getUTCMonth() + 1, 2), '-',
    zeropad(date.getUTCDate(), 2), 'T',
    zeropad(utc_date.getUTCHours(), 2), ':',
    zeropad(date.getUTCMinutes(), 2), ':',
    zeropad(date.getUTCSeconds(), 2),
    get_offset_string(date.getTimezoneOffset()/60)
    );
};

//
// ### function log_output (options)
// #### @options {Object} All information about the log serialization.
// Generic logging function for returning timestamped strings
// with the following options:
//
//    {
//      level:     'level to add to serialized message',
//      message:   'message to serialize',
//      meta:      'additional logging metadata to serialize',
//      colorize:  false, // Colorizes output (only if `.json` is false)
//      timestamp: true   // Adds a timestamp to the serialized message
//    }
//
exports.log_output = function (options) {
  var timestampFN = typeof options.timestamp === 'function'
                  ? options.timestamp
                  : exports.timestamp,
      timestamp   = options.timestamp ? timestampFN() : null,
      meta        = options.meta ? common.clone(cycle.decycle(options.meta)) : null,
      output;

  //
  // raw mode is intended for outputting winston as streaming JSON to STDOuT
  //
  if (options.raw) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta: meta };
    }
    output         = common.clone(meta) || {};
    output.s       = options.level;
    output.m       = options.message;
    if (timestamp){
      output.time    = timestampFN();
    }
    return JSON.stringify(output);
  }

  //
  // json mode is intended for pretty printing multi-line json to the terminal
  //
  if (options.json) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta: meta };
    }

    output         = exports.clone(meta) || {};
    output.level   = options.level;
    output.message = options.message;

    if (timestamp) {
      output.timestamp = timestamp;
    }

    if (typeof options.stringify === 'function') {
      return options.stringify(output);
    }

    return JSON.stringify(output, function (key, value) {
      return value instanceof Buffer
        ? value.toString('base64')
        : value;
    });
  }

  output = timestamp ? ''.concat('[', timestamp, '] ') : '';
  output += options.colorize ? config.colorize(options.level.toUpperCase()) : options.level.toUpperCase();
  output += (': ' + options.message);

  if (meta) {
    if (typeof meta !== 'object') {
      output += ' ' + meta;
    }
    else if (Object.keys(meta).length > 0) {
      output += ' ' + (options.prettyPrint ? ('\n' + util.inspect(meta, false, null, options.colorize)) : common.serialize(meta));
    }
  }

  return output;
};

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
MixlibLog.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }

  var self = this,
      output;

  output = exports.log_output({
    colorize:    this.colorize,
    json:        this.json,
    level:       level,
    message:     msg,
    meta:        meta,
    stringify:   this.stringify,
    timestamp:   this.timestamp,
    prettyPrint: this.prettyPrint,
    raw:         this.raw
  });

  if (level === 'error' || level === 'debug') {
    console.error(output);
  } else {
    console.log(output);
  }

  //
  // Emit the `logged` event immediately because the event loop
  // will not exit until `process.stdout` has drained anyway.
  //
  self.emit('logged');
  callback(null, true);  
};
