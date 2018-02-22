'use strict';

var redis = require('./providers/redis');

exports.saveAndLoad = redis.saveAndLoad;

exports.save = redis.save;

exports.load = redis.load;