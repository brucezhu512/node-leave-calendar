var express = require('express');
var router = express.Router();

const leaveUtil = require('../database/domains/leave');
const catchupUtil = require('../database/domains/catchup');
const reportUtil = require('../database/domains/report');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dataFormat = 'YYYY-MM-DD';

/* GET dashboard page. */
router.get('/', async (req, res, next) => {
  const uid = req.session.userProfile.id;
  const dateBase = moment('2018-03-01');
  const dateStart = monday(dateBase);
  const dateEnd = friday(dateBase);
  const report = await reportUtil.generate({uid: uid, dateStart: dateStart, dateEnd: dateEnd});
  const leaves = await leaveUtil.selectByUid(uid, dateStart, dateEnd);
  const catchups = await catchupUtil.selectByUid(uid, dateStart, dateEnd);
  const chartStats = getChartStats(dateStart, dateEnd, report);
      
  res.render('homepage', { title: 'Homepage', 
                           report: report,
                           leaves: leaves,
                           catchups: catchups,
                           chartLabels: chartStats.labels.toString(),
                           chartLeaves : chartStats.leaves.toString(),
                           chartCatchups: chartStats.catchups.toString()
                         });
});

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
      leaves[moment(rec.leaveDate).diff(from, 'd')]++;
    }

    if (rec.catchupDate) {
      catchups[moment(rec.catchupDate).diff(from, 'd')]++;
    }
  })

  return { labels: labels, leaves: leaves, catchups: catchups };
}

function monday(m = moment()) {
  return moment(m).subtract(m.weekday()-1, 'd');
}

function friday(m = moment()) {
  return moment(m).add(5-m.weekday(), 'd');
}
