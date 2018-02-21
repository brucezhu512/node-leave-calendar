var express = require('express');
var router = express.Router();

var redis = require('./db/redis');

router.post('/', async (req, res, next) => {
  let userProfile = req.session.userProfile;
  userProfile.credential = req.body.newPassword;
  req.session.userProfile = await redis.saveAndLoad('user', userProfile.id, userProfile);
  console.log('userProfile -> ' + JSON.stringify(req.session.userProfile));
  res.render('profile', { title: 'User Profile',
                          uid: userProfile.id,
                          name: userProfile.name,
                          pods: userProfile.pods,
                          roles: userProfile.roles,
                          message: ''
                        });
});

module.exports = router;