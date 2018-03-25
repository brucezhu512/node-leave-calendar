'use strict';

const dbname = 'mysql';
var database = require('./providers/' + dbname);

exports.save = database.save;

exports.load = database.load;

exports.select = database.select;

exports.find = database.find;

exports.delete = database.delete;

exports.reset = database.reset;

exports.count = database.count;

exports.update = database.update;

