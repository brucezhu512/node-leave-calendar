'use strict'

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

exports.moment = (date, time) => {
  return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
}

exports.monday = (m, includesTime = true) => {
  const mDate = moment(m).subtract(m.weekday()-1, 'd');
  return includesTime ? mDate : mDate.set({'h': 0, 'm': 0, 's' : 0, 'ms' : 0});
}

exports.friday = (m, includesTime = true) => {
  const mDate = moment(m).add(5-m.weekday(), 'd');
  return includesTime ? mDate : mDate.set({'h': 0, 'm': 0, 's' : 0, 'ms' : 0});
}
