var express = require('express');
var router = express.Router();

const userUtil = require('../database/domains/user');
const md5 = require('md5');

// Global env variables
var env = require("./consts").env; 

/* GET signin page. */
router.get('/', function(req, res, next) {
  res.render('signin', 
    { system: 'Leave Calendar',
      message: '',
      uid: req.cookies[env.cookie.name]
    });
});

router.post('/', async (req, res, next) => {
  const uid = req.body.inputUid;
  const pwd = req.body.inputPassword;

  const isAuth = await userUtil.authenticate(uid, md5(pwd));
  if(isAuth) {
    req.session.userProfile = await userUtil.update(uid, (usr) => {
      usr.lastSignTimestamp = new Date();
    });

    // Cache username in cookie if 'Remember Me' is ticked
    if(req.body.rememberMe) {
      res.cookie(env.cookie.name, userProfile.id, { domain: env.cookie.domain, path: env.cookie.path });
    }
    
    if (req.session.previousUrl) {
      res.redirect(req.session.previousUrl);
    } else {
      res.redirect('/timesheet');
    }
  } else {
    res.render('signin', 
      { system: 'Leave Calendar',
        message: 'Incorrect UID or password',
        uid: ''
      });
  }
});

module.exports = router;
