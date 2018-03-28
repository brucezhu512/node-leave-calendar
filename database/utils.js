'use strict';

const database = require(`./providers/mysql`);

exports.save = database.save;

exports.load = database.load;

exports.select = database.select;

exports.selectWithColumn = database.selectWithColumn;

exports.find = database.find;

exports.delete = database.delete;

exports.reset = database.reset;

exports.count = database.count;

exports.update = database.update;

