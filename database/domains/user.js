'use strict';

const debug = require('debug')('domain:user');

const DOMAIN = { name: 'User'};

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const dbUtils = require('../utils');

exports.load = async (uid) => {
  return await dbUtils.load(DOMAIN, {id: uid});
};

exports.save = async (user) => {
  return await dbUtils.save(DOMAIN, {id: user.id}, user);
};

exports.update = async (uid, callback) => {
  return await dbUtils.update(DOMAIN, {id: uid}, (user) => {
    callback(user);
    user.lastUpdateTimestamp = new Date();
  });
};

exports.isSync = async (expected) => {
  const latest = await exports.load(expected.id);
  return moment(expected.lastUpdateTimestamp).isSame(moment(expected.lastUpdateTimestamp));
};

exports.authenticate = async (uid, md5Pwd) => {
  const latest = await exports.load(uid);
  const auth = (latest.credential == md5Pwd);
  if (auth) {
    latest.lastSignTimestamp = new Date();
    await exports.save(latest);
  }
  return auth;
};

exports.select = async (criteria) => {
  return await dbUtils.select(DOMAIN, criteria);
}

exports.selectByPod = async (pod) => {
  return await exports.select({pod: pod});
}

exports.init = async () => {
  await dbUtils.reset(DOMAIN);
  const userData = require('../data/data.json')[DOMAIN.name];
  for (let user of userData) {
    await exports.save(user);
    debug(`Import user ${user.id} successfully.`);
  }
};
