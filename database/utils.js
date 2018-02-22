'use strict';

var redis = require('./providers/redis');

exports.save = redis.save;

exports.load = async (domain, key, criteria = () => { return true; }) => {
  const data = await loadByProvider(domain, key);
  return criteria(data) ? data : null;
};

exports.find = async (domain, key, criteria) => {
  const data = await loadByProvider(domain, key);
  return criteria(data);
};

exports.update = async (domain, key, callback = () => {}) => {
  let data = await loadByProvider(domain, key);
  if (data == null) {
    throw new Error('No data was found using key ' + key);
  }
  
  callback(data);
  return await exports.save(domain, key, data);
};

async function loadByProvider(domain, key) {
  return await redis.load(domain, key);
}