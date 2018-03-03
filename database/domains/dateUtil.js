'use strict'

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

exports.moment = (date, time) => {
  return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
}


exports.getWeekDateRange = (momentNow) => {
  const dayOfWeek = momentNow.weekday();
  const dateClone = moment(momentNow).hour(0).minute(0).second(0).millisecond(0);
  const dateStart = moment(dateClone).subtract(dayOfWeek-1, 'd');
  const dateEnd = moment(dateStart).add(4, 'd');
  return { start: dateStart.format(dataFormat), end: dateEnd.format(dataFormat) };
}