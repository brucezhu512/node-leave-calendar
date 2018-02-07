var express = require('express');
var router = express.Router();

/* GET bootstrap template. */
router.get('/', function(req, res, next) {
  res.render('bootstrap', { name: 'Bruce' });
});

module.exports = router;
