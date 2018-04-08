var express = require('express');
var router = express.Router();

const TimeRecord = require('../database/domains/timerecord');
const leaveUtil = new TimeRecord('leave', 1);
const catchupUtil = new TimeRecord('catchup', 2);
const reportUtil = require('../database/domains/report');
const dtUtil = require('../database/domains/dateutil');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dateFormat = 'YYYY-MM-DD';

/* GET Timesheet page. */
router.get('/', async (req, res, next) => {
  const uid = req.session.userProfile.id;
  const respJson = await loadTimesheet(uid, req.query.datePeriod);
  res.render('timesheet', respJson);
});

router.post('/', async (req, res, next) => {
  const uid = req.session.userProfile.id;
  const respJson = await loadTimesheet(uid, req.body.datePeriod);
  res.render('timesheet', respJson);
});

async function loadTimesheet(uid, datePeriod) {
  const dateBase = getBaseDate(datePeriod);
  const dateStart = dtUtil.monday(dateBase, false);
  const dateEnd = dtUtil.friday(dateBase, false);

  const report = await reportUtil.generate({uid: uid, dateStart: dateStart, dateEnd: dateEnd});
  const leaves = await leaveUtil.selectByUid(uid, dateStart, dateEnd);
  const catchups = await catchupUtil.selectByUid(uid, dateStart, dateEnd);
  const chartStats = getChartStats(dateStart, dateEnd, report);
      
  return { 
    title: 'Timesheet', 
    dateStart: dateStart.format(dateFormat),
    dateEnd: dateEnd.format(dateFormat),
    titlePeriod: `${dateStart.format('DD/MMM')} ~ ${dateEnd.format('DD/MMM')}`,
    datePeriod: datePeriod ? datePeriod : 'sample',
    report: report.filter(r => r.leaveDate != '-'),
    leaves: sortByDateTime(leaves),
    catchups: sortByDateTime(catchups),
    chartLabels: chartStats.labels.toString(),
    chartLeaves : chartStats.leaves.toString(),
    chartCatchups: chartStats.catchups.toString()
  };
}

module.exports = router;

function getBaseDate(datePeriod) {
  if(datePeriod == 'this-week') {
    return moment();
  } else if(datePeriod == 'last-week') {
    return moment().subtract(7, 'd');
  } else {
    return moment('2018-03-01', dateFormat); // Sample data - TODO - remove later
  }
}

function getChartStats(from, to, report) {
  const date = moment(from);
  let labels = [];
  while (date.isSameOrBefore(to, 'd')) {
    labels.push(`"${date.format('DD/MMM')} ${weekdays[labels.length]}"`);
    date.add(1, 'd');
  }
  
  const leaves = Array(labels.length).fill(0);
  const catchups = Array(labels.length).fill(0);
  report.forEach(rec => {
    if (rec.leaveDate) {
      leaves[moment(rec.leaveDate, dateFormat).diff(from, 'd')]++;
    }

    if (rec.catchupDate) {
      catchups[moment(rec.catchupDate, dateFormat).diff(from, 'd')]++;
    }
  })

  return { labels: labels, leaves: leaves, catchups: catchups };
}

function sortByDateTime(arr) {
  return (arr) ? 
    arr.sort((a,b) => {
      return dtUtil.moment(a.date, a.timeStart).isAfter(dtUtil.moment(b.date, b.timeStart))
    }): [];
}

