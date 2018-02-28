var express = require('express');
var router = express.Router();
var mongoose = require('../app').mangoose;

/* GET users listing. */

router.get('/:user_id', function (req, res, next) {
    res.send("USER 1");
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
