var express = require('express');
var router = express.Router();

var userUtil = require('../database/domains/user');

router.post('/', async (req, res, next) => {
  let profileInSession = req.session.userProfile;
  const uid = profileInSession.id;
  const newPwd = req.body.newPassword;

  let updated = false;
  if (await userUtil.isSync(profileInSession)) {
    updated = await userUtil.update(uid, (p) => {
      p.credential = newPwd;
    });
  }

  let message = 'Fail to change the password';
  if (updated) {
    req.session.userProfile = await userUtil.load(uid);
    message = 'Password changed successfully';
  }

  const updatedProfile = req.session.userProfile;
  res.render('profile', { title: 'User Profile',
                          uid: updatedProfile.id,
                          name: updatedProfile.name,
                          pods: updatedProfile.pods,
                          roles: updatedProfile.roles,
                          message: message
                        });
});

module.exports = router;