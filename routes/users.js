var express = require('express');
var router = express.Router();
var mongoose = require('../app').mangoose;
var app = require('../app');
var User = require("../models/user");

/* GET users listing. */

router.get('/:user_id', function (req, res, next) {
    User.findOne({"_id": req.params.user_id}, function (error, user_found) {
        if (error) {
            res.send(app.generateJsonErrorMessage("The user with id " + req.params.user_id + " could not be found."));
        } else {
            res.send(user_found);
        }
    });
});

router.post('/', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (error, saved_user) {
        if (error) {
            res.send(error);
        } else {
            res.send(saved_user);
        }
    });
});

router.patch('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

router.delete('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

module.exports = router;
