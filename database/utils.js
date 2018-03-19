'use strict';

var redis = require('./providers/redis');

exports.save = redis.save;

exports.load = redis.load;

exports.select = redis.select;

exports.find = redis.find;

exports.delete = redis.delete;

exports.reset = redis.reset;

exports.count = redis.count;

exports.update = async (domain, key, callback) => {
  let data = await redis.load(domain, key);
  if (data == null) {
    throw new Error('No data was found using key: ' + key);
  }
  
  callback(data);
  redis.save(domain, key, data);
  return data;
};