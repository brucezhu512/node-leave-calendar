var express = require('express');
var router = express.Router();

const leaveUtil = require('../database/domains/leave');
const catchupUtil = require('../database/domains/catchup');

router.post('/', async (req, res, next) => {
  let profileInSession = req.session.userProfile;
  const uid = profileInSession.id;
  const dateStart = req.session.dateStart;
  const dateEnd = req.session.dateEnd;
  const leaves = JSON.parse(req.body.leaves);
  const catchups = JSON.parse(req.body.catchups);
  await leaveUtil.submitByDateRange(uid, dateStart, dateEnd, leaves);
  await catchupUtil.submitByDateRange(uid, dateStart, dateEnd, catchups);

  res.send('/timesheet');
});

module.exports = router;