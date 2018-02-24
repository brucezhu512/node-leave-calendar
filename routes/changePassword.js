var express = require('express');
var router = express.Router();

var userUtil = require('../database/domains/user');

router.post('/', async (req, res, next) => {
  let profileInSession = req.session.userProfile;
  const uid = profileInSession.id;
  const newPwd = req.body.newPassword;

  let message = 'Fail to change the password';
  if (await userUtil.isSync(profileInSession)) {
    req.session.userProfile = await userUtil.update(uid, (p) => {
      p.credential = newPwd;
    });
    message = 'Password changed successfully';
  } else {
    message = 'User profile was just updated by someone else, please re';
  }

  res.render('profile', { title: 'User Profile',
                          uid: profileInSession.id,
                          name: profileInSession.name,
                          pods: profileInSession.pods,
                          roles: profileInSession.roles,
                          message: message
                        });
});

module.exports = router;