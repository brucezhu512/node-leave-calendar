'use strict';

const DOMAIN = 'CATCHUP';

const dbUtils = require('../utils');
const catchupData = require('../data/data.json')[DOMAIN];

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

exports.load = async (id) => {
  return await dbUtils.load(DOMAIN, id);
};

exports.save = async (catchup) => {
  return await dbUtils.save(DOMAIN, catchup.id, catchup);
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
  return await exports.select((catchup) => {
    const dtCatchup = moment(catchup.date);
    return moreCriteria(catchup) && dtCatchup.isBetween(dtFrom, dtTo, 'd', '[]');
  });
}

exports.delete = async (key) => {
  return await dbUtils.delete(DOMAIN, key); 
}

exports.submitByDateRange = async (uid, from, to, newCatchups) => {
  const catchups = await exports.selectByDateRange(from, to, c => {
    return c.uid == uid;
  });
  for (let c of catchups) {
    await exports.delete(c.id);
  }
  
  for (let newc of newCatchups) {
    if(moment(newc.date).isBetween(moment(from), moment(to), 'd', '[]')) {
      newc.uid = uid;
      await exports.save(newc);
    }
  }
}

exports.init = async () => {
  await dbUtils.reset(DOMAIN);
  let stats = {};
  for (let catchup of catchupData) {
    catchup.id = Date.now();
    await exports.save(catchup);
    const rowCount = stats[catchup.uid];
    stats[catchup.uid] = rowCount ? (rowCount+1) : 1;
  }

  for (let uid in stats) {
    if (stats.hasOwnProperty(uid)) {
      console.log(`Import ${stats[uid]} catchup row(s) of ${uid} successfully.`);
    }
  }
};