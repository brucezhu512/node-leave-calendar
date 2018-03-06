'use strict';

const DOMAIN = 'LEAVE';

const dbUtils = require('../utils');
const leaveData = require('../data/data.json')[DOMAIN];

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

exports.load = async (id) => {
  return await dbUtils.load(DOMAIN, id);
};

exports.save = async (leave) => {
  return await dbUtils.save(DOMAIN, leave.id, leave);
};

exports.select = async (criteria) => {
  return await dbUtils.select(DOMAIN, criteria);
};

exports.selectByUid = async (uid, from, to) => {
  return await exports.selectByDateRange(from, to, lv => {
    return lv.uid == uid;
  });
};

exports.selectByDateRange = async (from, to, moreCriteria) => {
  const dtFrom = moment(from);
  const dtTo = moment(to);
  return await exports.select((leave) => {
    const dtLeave = moment(leave.date);
    return moreCriteria(leave) && dtLeave.isBetween(dtFrom, dtTo, 'd', '[]');
  });
}

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