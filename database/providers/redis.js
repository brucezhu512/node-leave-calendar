'use strict';

var redis = require('redis');

exports.save = async (domain, key, data) => {
  return await runWithClient(async (client) => {
    let saved = await saveWithPromise(client, domain, key, data)
    return saved;
  });
}

exports.load = async (domain, key) => {
  return await runWithClient(async (client) => {
    let data = await loadWithPromise(client, domain, key);
    return data;
  });
}

function getDomainKey(domain, key) {
  return `#${domain}#_#${key}`;
}

function runWithClient(callback) {
  let client = redis.createClient();
  try {
    return callback(client);
  } finally {
    client.quit();
  }
}

function saveWithPromise(client, domain, key, json) {
  return new Promise((resolve, reject) => {
    const domainKey = getDomainKey(domain, key);
    client.hmset(domainKey, json, (err, res) => {
      if(err) reject(err);
      resolve(true);
    });
  }).catch(e => {
    reject(e);
  });
}

function loadWithPromise(client, domain, key) {
  return new Promise((resolve, reject) => {
    const domainKey = getDomainKey(domain, key);
    client.hgetall(domainKey, (err, val) => {
      if(err) reject(err);
      resolve(val);
    });
  }).catch(e => {
    reject(e);
  });
}
