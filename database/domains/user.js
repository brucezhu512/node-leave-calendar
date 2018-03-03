'use strict';

const dbUtils = require('../utils');
const userData = require('../data/users.json').profiles;

const DOMAIN = 'USER';

exports.load = async (uid) => {
  return await dbUtils.load(DOMAIN, uid.toUpperCase());
};

exports.save = async (user) => {
  return await dbUtils.save(DOMAIN, user.id.toUpperCase(), user);
};

exports.update = async (uid, callback) => {
  return await dbUtils.update(DOMAIN, uid.toUpperCase(), (user) => {
    callback(user);
    user.lastUpdateTimestamp = Date.now();
  });
};

exports.isSync = async (expected) => {
  const latest = await exports.load(expected.id);
  return latest.lastUpdateTimestamp == expected.lastUpdateTimestamp;
};

exports.authenticate = async (uid, password) => {
  const latest = await exports.load(uid);
  const auth = (latest.credential == password);
  if (auth) {
    latest.lastSignTimestamp = Date.now();
    await exports.save(latest);
  }
  return auth;
};

exports.init = async () => {
  await dbUtils.reset(DOMAIN);
  for (let user of userData) {
    await exports.save(user);
    console.log(`Import user ${user.id} successfully.`);
  }
};