var express = require('express');
var router = express.Router();

/* GET signin page. */
router.get('/', function(req, res, next) {
  res.render('signin', { system: 'Leave Calendar' });
});

router.post('/', function(req, res, next) {
  res.send(req.body.inputEmail);
})


module.exports = router;
