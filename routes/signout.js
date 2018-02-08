var express = require('express');
var router = express.Router();

// Global env variables
var env = require("./consts.js").env; 

/* GET signin page. */
router.all('/', function(req, res, next) {
  req.session.destroy();
  //res.clearCookie(env.cookie.name, { domain: env.cookie.domain, path: env.cookie.path });
  res.redirect('/');
});

module.exports = router;
