'use strict';

var redis = require('redis');

exports.saveAndLoad = async (domain, key, data) => {
  if(await exports.save(domain, key, data)) {
    return await exports.load(domain, key);
  } else {
    throw new Error(`Fail to save ${JSON.stringify(data)} with key '${key}'`);
  }
}

exports.save = async (domain, key, data) => {
  return await runWithClient(async (client) => {
    let saved = await saveWithPromise(client, domain, key, data)
    log('Saved: ' + JSON.stringify(data));
    return saved;
  });
}

exports.load = async (domain, key) => {
  return await runWithClient(async (client) => {
    let data = await loadWithPromise(client, domain, key);
    log('Loaded: ' + JSON.stringify(data));
    return data;
  });
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
    client.hmset(key, json, (err, res) => {
      if(err) reject(false);
      resolve(true);
    });
  }).catch(e => {
    // Failed to save data
    log('Fail to save JSON: ' + e);
    reject(false);
  });
}

function loadWithPromise(client, domain, key) {
  return new Promise((resolve, reject) => {
    client.hgetall(key, (err, val) => {
      if(err) reject(err);
      resolve(val);
    });
  }).catch(e => {
    // Failed to load data
    log('Fail to load JSON: ' + e);
    reject(e);
  });
}

function log(msg) {
  //console.log('## [redis] - ' + msg);
}