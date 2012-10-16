/*
 * winston-mixlib-log.js: Tests for instances of the Mixlib Log Transport
 *
 * (C) 2012 Josh Toft
 * MIT LICENSE
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    winston = require('winston'),
    helpers = require('winston/test/helpers'),
    transport = require('winston/test/transports/transport'),
    MixlibLog = require('../lib/winston-mixlib-log').MixlibLog

vows.describe('winston-mixlib-log').addBatch({
  "An instance of the Mixlib Log Transport": transport(MixlibLog, {})
}).export(module);
