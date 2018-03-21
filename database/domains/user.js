'use strict';

const DOMAIN = 'USER';

const dbUtils = require('../utils');
const userData = require('../data/data.json')[DOMAIN];

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

exports.authenticate = async (uid, md5Pwd) => {
  const latest = await exports.load(uid);
  const auth = (latest.credential == md5Pwd);
  if (auth) {
    latest.lastSignTimestamp = Date.now();
    await exports.save(latest);
  }
  return auth;
};

exports.select = async (criteria) => {
  return await dbUtils.select(DOMAIN, criteria);
}

exports.selectByPod = async (pods) => {
  return await exports.select((u) => pods.includes(u.pod));
}

exports.init = async () => {
  await dbUtils.reset(DOMAIN);
  for (let user of userData) {
    await exports.save(user);
    console.log(`Import user ${user.id} successfully.`);
  }
};