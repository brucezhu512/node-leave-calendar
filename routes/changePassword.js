var express = require('express');
var router = express.Router();

var userUtil = require('../database/domains/user');
var md5 = require('md5');

router.post('/', async (req, res, next) => {
  let profileInSession = req.session.userProfile;
  const uid = profileInSession.id;
  const newPwdMd5 = md5(req.body.newPassword);

  let message = 'Fail to change the password';
  if (await userUtil.isSync(profileInSession)) {
    req.session.userProfile = await userUtil.update(uid, (p) => {
      p.credential = newPwdMd5;
    });
    message = 'Password changed successfully';
  } else {
    message = 'User profile was just updated by someone else, please re-signin';
  }

  res.render('profile', { title: 'User Profile',
                          uid: profileInSession.id,
                          name: profileInSession.name,
                          pod: profileInSession.pod,
                          role: profileInSession.role,
                          message: message
                        });
});

module.exports = router;