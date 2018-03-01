var express = require('express');
var router = express.Router();

const leaveUtil = require('../database/domains/leave');

const moment = require('moment-timezone');
moment.locale('en');
moment.tz.setDefault("Asia/Shanghai");

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dataFormat = 'YYYY-MM-DD';

/* GET dashboard page. */
router.get('/', async (req, res, next) => {
  const uid = req.session.userProfile.id;
  const data = await getLeaves(uid, 'this_week')
  const leaves = data.leaves
    .sort((lv1, lv2) => { 
      return lv1.leaveDate < lv2.leaveDate || lv1.leaveTimeStart > lv2.leaveTimeStart;
     });    
      
  res.render('homepage', { title: 'Homepage', 
                           chartLabels: getChartLabels('this_week'),
                           leaves: leaves,
                           chartLeaves : data.chartLeaves.toString(),
                           chartCatchups: data.chartCatchups.toString()
                         });
  
});

module.exports = router;

function getChartLabels(type) {
  if (type == "this_week") {
    let chartLabels = [];
    const today = moment();
    const dayOfWeek = today.weekday();
    let day = today.subtract(dayOfWeek, 'd');
    while (chartLabels.length < weekdays.length) {
      day.add(1, 'd');
      chartLabels.push(`"${day.format('DD/MMM')} ${weekdays[chartLabels.length]}"`); 
    }
    return chartLabels.toString();
  } else {
    throw new Error('Unknown period of time.');
  }
}

async function getLeaves(uid, type) {
  if(type == 'this_week') {
    const workdayRange = getWeekDateRange(moment());
    const dateStart = moment(workdayRange.start);
    const dateEnd = moment(workdayRange.end);
    const numberOfDays = dateEnd.diff(dateStart, 'd') + 1;
    const leaves = await leaveUtil.selectByUid(uid, workdayRange.start, workdayRange.end);
    const chartLeaves = Array(numberOfDays).fill(0);
    const chartCatchups = Array(numberOfDays).fill(0);
 
    leaves.forEach(lv => {
      let dateLeave = moment(lv.leaveDate);
      let idxl = dateLeave.diff(dateStart, 'd');
      chartLeaves[idxl]++;
      let dateCatchup = moment(lv.catchupDate);
      let idxc = dateCatchup.diff(dateStart, 'd');
      chartCatchups[idxc]++;
    });
    
    return {leaves: leaves, chartLeaves: chartLeaves, chartCatchups: chartCatchups}

  } else {
    throw new Error('Unknown period of time.');
  }
}

function getWeekDateRange(momentNow) {
  const dayOfWeek = momentNow.weekday();
  const dateClone = moment(momentNow).hour(0).minute(0).second(0).millisecond(0);
  const dateStart = moment(dateClone).subtract(dayOfWeek-1, 'd');
  const dateEnd = moment(dateStart).add(4, 'd');
  return { start: dateStart.format(dataFormat), end: dateEnd.format(dataFormat) };
}
