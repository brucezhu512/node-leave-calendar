var express = require('express');
var router = express.Router();

const TimeRecord = require('../database/domains/timerecord');
const leaveUtil = new TimeRecord('leave', 1);
const catchupUtil = new TimeRecord('catchup', 2);

router.post('/', async (req, res, next) => {
  const uid = req.session.userProfile.id;
  const dateStart = req.body.dateStart;
  const dateEnd = req.body.dateEnd;
  const leaves = JSON.parse(req.body.leaves);
  const catchups = JSON.parse(req.body.catchups);
  await leaveUtil.submitByDateRange(uid, dateStart, dateEnd, leaves);
  await catchupUtil.submitByDateRange(uid, dateStart, dateEnd, catchups);

  res.send('/timesheet');
});

module.exports = router;