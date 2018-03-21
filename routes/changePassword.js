var express = require('express');
var router = express.Router();

var userUtil = require('../database/domains/user');
var md5 = require('md5');

router.post('/', async (req, res, next) => {
  let profileInSession = req.session.userProfile;
  const uid = profileInSession.id;

  if(!req.body.newPassword) {
    res.send('Empty password is not allowed.');
  }

  if (await userUtil.isSync(profileInSession)) {
    const newPwdMd5 = md5(req.body.newPassword);
    req.session.userProfile = await userUtil.update(uid, (p) => {
      p.credential = newPwdMd5;
    });
    res.send('Password changed successfully.');
  } else {
    res.send('User profile was just updated by someone else, please re-signin.');
  }

  res.send(message);
});

module.exports = router;