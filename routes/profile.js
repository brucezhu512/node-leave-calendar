var express = require('express');
var router = express.Router();

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  let userProfile = req.session.userProfile;
  res.render('profile', { title: 'User Profile',
                          uid: userProfile.id,
                          name: userProfile.name,
                          pod: userProfile.pod,
                          role: userProfile.role
                        });
});

module.exports = router;
