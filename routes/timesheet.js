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
  const dateBase = moment('2018-03-01', dateFormat);
  await loadTimesheet(req, res, dateBase);
});

router.post('/', async (req, res, next) => {
  const datePeriod = req.body.datePeriod;
  let dateBase = moment('2018-03-01', dateFormat); // Sample data - TODO - remove later
  if(datePeriod == 'this-week') {
    dateBase = moment();
  } else if(datePeriod == 'last-week') {
    dateBase = moment().subtract(7, 'd');
  } 
  await loadTimesheet(req, res, dateBase);
});

async function loadTimesheet(req, res, dateBase) {
  const uid = req.session.userProfile.id;
  const dateStart = dtUtil.monday(dateBase);
  const dateEnd = dtUtil.friday(dateBase);

  req.session.dateStart = dateStart;
  req.session.dateEnd = dateEnd;

  const report = await reportUtil.generate({uid: uid, dateStart: dateStart, dateEnd: dateEnd});
  const leaves = await leaveUtil.selectByUid(uid, dateStart, dateEnd);
  const catchups = await catchupUtil.selectByUid(uid, dateStart, dateEnd);
  const chartStats = getChartStats(dateStart, dateEnd, report);
      
  res.render('timesheet', { title: 'Timesheet', 
                            dateStart: dateStart.format(dateFormat),
                            dateEnd: dateEnd.format(dateFormat),
                            titlePeriod: `${dateStart.format('DD/MMM')} ~ ${dateEnd.format('DD/MMM')}`,
                            datePeriod: req.body.datePeriod ? req.body.datePeriod : 'sample',
                            report: report.filter(r => r.leaveDate != '-'),
                            leaves: sortByDateTime(leaves),
                            catchups: sortByDateTime(catchups),
                            chartLabels: chartStats.labels.toString(),
                            chartLeaves : chartStats.leaves.toString(),
                            chartCatchups: chartStats.catchups.toString()
                          });
}

module.exports = router;

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

