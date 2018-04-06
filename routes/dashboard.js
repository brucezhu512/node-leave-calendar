var express = require('express');
var router = express.Router();

const reportUtil = require('../database/domains/report');
const dtUtil = require('../database/domains/dateutil');
const ReferenceCode = require('../database/domains/referencecode');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dateFormat = 'YYYY-MM-DD';

/* GET dashboard page. */
router.get('/', async (req, res, next) => {
  const respJson = await loadDashboard(null, ["Moonraker"]);
  res.render('dashboard', respJson);
});

router.post('/', async (req, res, next) => {
  const datePeriod = req.body.datePeriod;
  const pods = [];
  let i = 0;
  while(i < 10) {
    const pod = req.body['pod'+i];
    if (pod == undefined) {
      break;
    } else if (pod && pod.length > 0) {
      pods.push(pod);
    }
    i++;
  }

  const respJson = await loadDashboard(datePeriod, pods);
  res.render('dashboard', respJson);
});

async function loadDashboard(datePeriod, pods) {
  let dateBase = moment('2018-03-01', dateFormat); // Sample data - TODO - remove later
  if(datePeriod == 'this-week') {
    dateBase = moment();
  } else if(datePeriod == 'last-week') {
    dateBase = moment().subtract(7, 'd');
  }

  const dateStart = dtUtil.monday(dateBase, false);
  const dateEnd = dtUtil.friday(dateBase, false);

  const report = await reportUtil.generate({ pods: pods, dateStart: dateStart, dateEnd: dateEnd});
  const chartStats = getChartStats(dateStart, dateEnd, report);
  const allPods = await new ReferenceCode('pod').getAll();

  return { 
    title: 'Dashboard', 
    titlePeriod: `${dateStart.format('DD/MMM')} ~ ${dateEnd.format('DD/MMM')}`,
    datePeriod: datePeriod ? datePeriod : 'sample',
    allPods: allPods.map(p => p.name),
    selectedPods: pods,
    report: report.filter(r => r.leaveDate != '-'),
    chartLabels: chartStats.labels.toString(),
    chartLeaves : chartStats.leaves.toString(),
    chartCatchups: chartStats.catchups.toString()
  }
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


 
