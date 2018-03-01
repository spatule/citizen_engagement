var express = require('express');
var router = express.Router();
var debug = require('debug')('users');
var mongoose = require('mongoose');
var app = require('../app');
var User = require("../models/user");
const ObjectId = mongoose.Types.ObjectId;

/* GET users listing. */

router.get('/:user_id', function (req, res, next) {
    User.findOne({"_id": req.params.user_id}, function (error, user_found) {
        if (error) {
            // err status 404
            res.send(app.generateJsonErrorMessage("The user with id " + req.params.user_id + " could not be found."));
        } else {
            res.send(user_found);
        }
    });
});

router.get('/', function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) {
            res.send(app.generateJsonErrorMessage("Error while trying to retrieve all users."));
        } else {
            var userMap = {};
            users.forEach(function (user) {
                userMap[user._id] = user;
            });

            res.send(userMap);
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
    const userId = req.params.user_id;
    User.findOne({"_id": userId}, function (error, user_found) {
        if (error) {
            if (ObjectId.isValid(userId)) {
                res.send(error);
            } else {
                next(error);
            }
        } else if (user_found) {
            user_found.remove(function(error) {
                if (error) {
                    return next(error);
                }
                debug(`Deleted user "${user_found.firstName},${user_found.lastName}"`);
                res.sendStatus(204);
            });
        } else {
            res.status(404);
            res.send(app.generateJsonErrorMessage("The user with id " + req.params.user_id + " could not be found."));
        }
    });
});

module.exports = router;
