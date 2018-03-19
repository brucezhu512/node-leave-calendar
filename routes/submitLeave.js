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
  console.log(dateStart);
  console.log(dateEnd);
  console.log(leaves);
  console.log(catchups);
  leaveUtil.submitByDateRange(uid, dateStart, dateEnd, leaves);
  catchupUtil.submitByDateRange(uid, dateStart, dateEnd, catchups);

  res.redirect('/homepage');
});

module.exports = router;