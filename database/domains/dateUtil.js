'use strict'

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

exports.moment = (date, time) => {
  return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
}

exports.monday = (m = moment()) => {
  return moment(m).subtract(m.weekday()-1, 'd');
}

exports.friday = (m = moment()) => {
  return moment(m).add(5-m.weekday(), 'd');
}