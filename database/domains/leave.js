'use strict';

const dbUtils = require('../utils');
const leaveData = require('../data/leaves.json').leaves;

const DOMAIN = 'LEAVE';

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");
const longAgo = '2000-01-01';
const longAfter = '2099-12-31';

exports.load = async (id) => {
  return await dbUtils.load(DOMAIN, id);
};

exports.save = async (leave) => {
  return await dbUtils.save(DOMAIN, leave.id, leave);
};

exports.select = async (criteria) => {
  return await dbUtils.select(DOMAIN, criteria);
};

exports.selectByUid = async (uid, from = longAgo, to = longAfter) => {
  const dtFrom = moment(from);
  const dtTo = moment(to);
  return await dbUtils.select(DOMAIN, (leave) => {
    const dtLeave = moment(leave.leaveDate);
    return leave.uid == uid
      && dtLeave.diff(dtFrom) >= 0
      && dtLeave.diff(dtTo) <= 0 ;
  });
};

exports.init = async () => {
  await dbUtils.reset(DOMAIN);
  let stats = {};
  for (let leave of leaveData) {
    leave.id = Date.now();
    await exports.save(leave);
    const rowCount = stats[leave.uid];
    stats[leave.uid] = rowCount ? (rowCount+1) : 1;
  }

  for (let uid in stats) {
    if (stats.hasOwnProperty(uid)) {
      console.log(`Import ${stats[uid]} leave row(s) of ${uid} successfully.`);
    }
  }
};