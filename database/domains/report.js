'use strict';

const leaveUtil = require('../domains/leave');
const catchupUtil = require('../domains/catchup');
const dtUtil = require('./dateUtil');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");
const longAgo = '2000-01-01';
const longAfter = '2099-12-31';

exports.generate = async (params) => {
  if (params.uid) {
    return loadPersonalSummary(params.uid, params.dateStart, params.dateEnd);
  } else {
    throw new Error('Unsupported type of report');
  } 
};

async function loadPersonalSummary(uid, from = longAgo, to = longAfter) {
  // load data of leaves
  let leaves = await loadDataByUid(leaveUtil, uid, from, to);

  // load data of catchups
  let catchups = await loadDataByUid(catchupUtil, uid, from, to);

  // consolidate leaves and catchups and generate the summary report of person
  return consolidate(uid, leaves, catchups);
}

async function loadDataByUid(dataUtil, uid, from = longAgo, to = longAfter) {
  let data = await dataUtil.selectByUid(uid, from, to);
  return (data) ? 
    data.sort((a,b) => {
      return dtUtil.moment(a.date, a.timeStart).isAfter(dtUtil.moment(b.date, b.timeStart))
    }): [];
}

function consolidate(uid, leaves, catchups) {
  let records = [];
  leaves.forEach(lv => {
    let timeStart = dtUtil.moment(lv.date, lv.timeStart);
    let timeEnd = dtUtil.moment(lv.date, lv.timeEnd);
    while (timeStart.isBefore(timeEnd, 'h')) {
      records.push( { "uid": uid,
                      "leaveDate": lv.date,
                      "leaveTimeStart": timeStart.format('H:mm'),
                      "leaveTimeEnd": timeStart.add(1, 'h').format('H:mm'),
                      "duration" : 1,
                      "catchupDate": "",
                      "catchupTimeStart": "",
                      "catchupTimeEnd": ""
                    });
    }
  });

  let idx = 0;
  catchups.forEach((c) => {
    let timeStart = dtUtil.moment(c.date, c.timeStart);
    let timeEnd = dtUtil.moment(c.date, c.timeEnd);
    while (timeStart.isBefore(timeEnd, 'h')) {
      let r = records[idx]; 
      if(r) {
        r.catchupDate = c.date;
        r.catchupTimeStart = timeStart.format('H:mm');
        r.catchupTimeEnd = timeStart.add(1, 'h').format('H:mm');
      } else {
        records.push( { "uid": uid,
                        "leaveDate": "",
                        "leaveTimeStart": "",
                        "leaveTimeEnd": "",
                        "duration" : 1,
                        "catchupDate": c.date,
                        "catchupTimeStart": timeStart.format('H:mm'),
                        "catchupTimeEnd": timeStart.add(1, 'h').format('H:mm')
                      })
      }
      idx++;
    }
  });
  return records;
};


