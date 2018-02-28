var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('USERS');
});

router.get('/:user_id', function(req, res, next) {
  res.send('USER 1');
});

module.exports = router;
