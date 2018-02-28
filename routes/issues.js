var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('ISSUES');
});

router.get('/:issue_id', function (req, res, next) {
    res.send("ISSUE " + req.params.issue_id);
});

router.post('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

router.patch('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

router.delete('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

module.exports = router;
