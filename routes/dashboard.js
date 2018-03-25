var express = require('express');
var router = express.Router();

const reportUtil = require('../database/domains/report');
const userUtil = require('../database/domains/user');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dataFormat = 'YYYY-MM-DD';

/* GET dashboard page. */
router.get('/', async (req, res, next) => {
  const dateBase = moment('2018-03-01', dataFormat);
  await loadDashboard(req, res, dateBase);
});

async function loadDashboard(req, res, dateBase) {
  const uid = req.session.userProfile.id;
  const dateStart = monday(dateBase);
  const dateEnd = friday(dateBase);

  req.session.dateStart = dateStart;
  req.session.dateEnd = dateEnd;

  const report = await reportUtil.generate({ pods: ["Moonraker"], dateStart: dateStart, dateEnd: dateEnd});
  const chartStats = getChartStats(dateStart, dateEnd, report);

  res.render('dashboard', { title: 'Dashboard', 
                            titlePeriod: `${dateStart.format('DD/MMM')} ~ ${dateEnd.format('DD/MMM')}`,
                            datePeriod: req.body.datePeriod ? req.body.datePeriod : 'sample',
                            report: report.filter(r => r.leaveDate != '-'),
                            chartLabels: chartStats.labels.toString(),
                            chartLeaves : chartStats.leaves.toString(),
                            chartCatchups: chartStats.catchups.toString()
                          });
}

module.exports = router;

function getChartStats(from, to, report) {
  const usernames = [];
  const leaves = [];
  const catchups = [];
  
  report.forEach( row => {
    let username = `"${row.name}"`;
    if(usernames.includes(username)) {
      let idx = usernames.indexOf(username);
      leaves[idx] = leaves[idx] + ((row.leaveDate == '-') ? 0 : 1);
      catchups[idx] = catchups[idx] + ((row.catchupDate == '-') ? 0 : 1);
    } else {
      usernames.push(username);
      leaves.push((row.leaveDate == '-') ? 0 : 1);
      catchups.push((row.catchupDate == '-') ? 0 : 1);
    }
  });

  return { labels: usernames, leaves: leaves, catchups: catchups };
}

function monday(m = moment()) {
  return moment(m).subtract(m.weekday()-1, 'd');
}

function friday(m = moment()) {
  return moment(m).add(5-m.weekday(), 'd');
}

 
