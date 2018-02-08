var express = require('express');
var router = express.Router();

// Global env variables
var env = require("./consts.js").env; 

// Users data json file
var users = require("../data/users.json");

/* GET signin page. */
router.get('/', function(req, res, next) {
  res.render('signin', 
    { system: 'Leave Calendar',
      message: '',
      uid: req.cookies[env.cookie.name]
    });
});

router.post('/', function(req, res, next) {
  let uid = req.body.inputUid.toUpperCase();
  let userProfile = users.profiles[uid];
  if (userProfile && req.body.inputPassword === userProfile.credential) {
    req.session.userProfile = userProfile;
    // Cache username in cookie if 'Remember Me' is ticked
    if(req.body.rememberMe) {
      res.cookie(env.cookie.name, userProfile.id, { domain: env.cookie.domain, path: env.cookie.path });
    }

    if (req.session.previousUrl) {
      res.redirect(req.session.previousUrl);
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.render('signin', 
      { system: 'Leave Calendar',
        message: 'Incorrect UID or password',
        uid: ''
      });
  }
})

module.exports = router;
