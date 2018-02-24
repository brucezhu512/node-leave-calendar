'use strict';

var redis = require('redis');

exports.save = async (domain, key, data) => {
  return await runWithClient(async (client) => {
    await registerWithPromise(client, domain, key)
    await saveWithPromise(client, domain, key, data);
  });
};

exports.load = async (domain, key) => {
  return await runWithClient(async (client) => {
    return await existsWithPromise(client, domain, key)
      .then(async (exists) => {
        return exists ?
          await loadWithPromise(client, domain, key) : null;
      });
  });
};

exports.find = async (domain, criteria) => {
  return await runWithClient(async (client) => {
    const keys = await listWithPromise(client, domain);
    for (let key of keys) {
      const val = await loadWithPromise(client, domain, key);
      if (criteria(val)) return val;
    }
    return null;
  });
};

exports.select = async (domain, criteria = (v) => { return true }) => {
  return await runWithClient(async (client) => {
    const keys = await listWithPromise(client, domain);
    let vals = [];
    for (let key of keys) {
      const val = await loadWithPromise(client, domain, key);
      if (criteria(val)) vals.push(val);
    }
    return vals;
  });
};

exports.count = async (domain, criteria = (v) => { return true }) => {
  return await runWithClient(async (client) => {
    const keys = await listWithPromise(client, domain);
    let count = 0;
    for (let key of keys) {
      const val = await loadWithPromise(client, domain, key);
      if (criteria(val)) count++;
    }
    return count;
  });
};

exports.reset = async (domain) => {
  return await runWithClient(async (client) => {
    return await resetWithPromise(client, domain);
  });
};

function getDomainKey(domain, key) {
  return `#${domain}#_[${key}]`;
}

function getDomainIndex(domain) {
  return `#${domain}_IDX#`;
}

async function runWithClient(callback) {
  let client = redis.createClient();
  try {
    return await callback(client);
  } finally {
    client.quit();
  }
}

function saveWithPromise(client, domain, key, json) {
  return new Promise((resolve, reject) => {
    const domainKey = getDomainKey(domain, key);
    client.hmset(domainKey, json, (err, res) => {
      if(err) reject(err);
      resolve();
    });
  });
}

function loadWithPromise(client, domain, key) {
  return new Promise((resolve, reject) => {
    const domainKey = getDomainKey(domain, key);
    client.hgetall(domainKey, (err, val) => {
      if(err) reject(err);
      resolve(val);
    });
  });
}

function listWithPromise(client, domain) {
  return new Promise((resolve, reject) => {
    const domainIndex = getDomainIndex(domain);
    client.smembers(domainIndex, (err, vals) => {
      if(err) reject(err);
      resolve(vals);
    });
  });
}

function existsWithPromise(client, domain, key) {
  return new Promise((resolve, reject) => {
    const domainIndex = getDomainIndex(domain);
    client.sismember(domainIndex, key, (err, reply) => {
      if(err) reject(err);
      resolve(reply == 1);
    });
  });
} 

function registerWithPromise(client, domain, key) {
  return new Promise((resolve, reject) => {
    const domainIndex = getDomainIndex(domain);
    client.sadd(domainIndex, key, (err, reply) => {
      if(err) reject(err);
      resolve();
    });
  });
}

function resetWithPromise(client, domain) {
  return new Promise((resolve, reject) => {
    const domainIndex = getDomainIndex(domain);
    client.smembers(domainIndex, (err, vals) => {
      if(err) reject(err);
      vals.forEach(val => {
        client.del(val);
      });
      client.del(domainIndex, (err, reply) => {
        if(err) reject(err);
        resolve(reply == 1);
      });
    });
  });
}
