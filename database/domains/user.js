'use strict';

var dbUtils = require('../utils');

const DOMAIN = 'USER';
const LAST_UPD_TIMESTAMP = 'lastUpdateTimestamp';
const LAST_SIGN_TIMESTAMP = 'lastSignTimestamp';

exports.load = async (uid) => {
  return await dbUtils.load(DOMAIN, uid.toUpperCase());
};

exports.save = async (user) => {
  return await dbUtils.save(DOMAIN, user.id.toUpperCase(), user);
};

exports.update = async (uid, callback) => {
  return await dbUtils.update(DOMAIN, uid.toUpperCase(), (user) => {
    callback(user);
    user[LAST_UPD_TIMESTAMP] = Date.now();
  });
};

exports.isSync = async (expected) => {
  const latest = await exports.load(expected.id);
  return latest[LAST_UPD_TIMESTAMP] == expected[LAST_UPD_TIMESTAMP];
};

exports.authenticate = async (uid, password) => {
  const latest = await exports.load(uid);
  return latest.credential == password;
};

exports.reset = async () => {
  return await dbUtils.reset(DOMAIN);
};