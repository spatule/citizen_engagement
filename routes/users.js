var express = require('express');
var router = express.Router();
var mongoose = require('../app').mangoose;
var app = require('../app');
var User = require("../models/user");

/* GET users listing. */

/**
 * @api {get} /users/:user_id Request a user's information
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 * @apiParam {user_id} id Unique Identifier of the user
 * @apiSuccess {Object} User User's informations
 * @apiSuccess {String} User.role User's role
 * @apiSuccess {String} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UserNotFound The user with <code>id</code> could not be found.
 */
router.get('/:user_id', function (req, res, next) {
    User.findOne({"_id": req.params.user_id}, function (error, user_found) {
        if (error) {
            res.send(app.generateJsonErrorMessage("The user with id " + req.params.user_id + " could not be found."));
        } else {
            res.send(user_found);
        }
    });
});

/**
 * @api {get} /users/ Retrieve all users' informations
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup User
 * @apiSuccess {Object[]} User User's informations
 * @apiSuccess {String} User.role User's role
 * @apiSuccess {String} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UserNotFound The user with <code>id</code> could not be found.
 */
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

/**
 * @api {post} /users/ Insert a new user.
 * @apiVersion 1.0.0
 * @apiName addUser
 * @apiGroup User
 * @apiSuccess {Object} User User's informations
 * @apiSuccess {String} User.role User's role
 * @apiSuccess {String} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UsersNotCreated The users could not be created.
 */
router.post('/', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (error, saved_user) {
        if (error) {
            res.send(app.generateJsonErrorMessage("The users could not be created."));
        } else {
            res.send(saved_user);
        }
    });
});

/**
 * @api {patch} /users/:user_id Update an existing user
 * @apiVersion 1.0.0
 * @apiName updateUser
 * @apiGroup User
 * @apiSuccess {Object} User Updated user's informations
 * @apiSuccess {String} User.role User's role
 * @apiSuccess {String} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UserNotUpdated Unable to update the user with ID <code>id</code>
 */
router.patch('/:user_id', function (req, res, next) {
    User.findByIdAndUpdate(req.params.user_id, {$set: req.body}, {new : false, runValidators: true}, function (error, user_updated) {
        if (error) {
            res.send(app.generateJsonErrorMessage("Unable to update the user with ID " + req.params.user_id));
        } else {
            res.send(user_updated);
        }

    });
});

/**
 * @api {delete} /users/:user_id Delete an existing user
 * @apiVersion 1.0.0
 * @apiName deleteUser
 * @apiGroup User
 * @apiSuccess {Object} User Updated user's informations
 * @apiSuccess {String} User.role User's role
 * @apiSuccess {String} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UserNotDeleted The users could not be deleted.
 */
router.delete('/:user_id', function (req, res, next) {
    res.send('USER 1');
});

module.exports = router;
