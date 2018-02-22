'use strict';

var dbUtils = require('../utils');

const DOMAIN = 'USER';
const LAST_UPD_TIMESTAMP = 'lastUpdateTimestamp';
const LAST_SIGN_TIMESTAMP = 'lastSignTimestamp';

exports.load = async (uid) => {
  return await dbUtils.load(DOMAIN, uid.toUpperCase());
};

exports.find = async (uid, criteria) => {
  return await dbUtils.find(DOMAIN, uid.toUpperCase(), criteria);
};

exports.isSync = async (expected) => {
  return await dbUtils.find(DOMAIN, expected.id.toUpperCase(), (profile) => {
    return profile[LAST_UPD_TIMESTAMP] == expected[LAST_UPD_TIMESTAMP];
  });
};

exports.save = async (uid, data) => {
  return await dbUtils.save(DOMAIN, uid.toUpperCase(), data);
};

exports.update = async (uid, callback) => {
  return await dbUtils.update(DOMAIN, uid.toUpperCase(), (data) => {
    callback(data);
    data[LAST_UPD_TIMESTAMP] = Date.now();
  });
};

exports.authenticate = async (uid, password) => {
  return await dbUtils.find(DOMAIN, uid.toUpperCase(), (user) => {
    return user.credential == password;
  })
};