var express = require('express');
var router = express.Router();
var debug = require('debug')('users');
var mongoose = require('mongoose');
var app = require('../app');
var User = require("../models/user");
var Issue = require("../models/issue");
const ObjectId = mongoose.Types.ObjectId;

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
            // err status 404
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
 * @apiSuccess {Date} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiSuccess {Integer} User.issuesCount Additionnal field which is the number of issues reported by the user
 * @apiError UserNotFound The user with <code>id</code> could not be found.
 */
router.get('/', function (req, res, next) {
    exports.getAllUsers(function (users) {
        if (users == null) {
            res.send(app.generateJsonErrorMessage("Error while trying to retrieve all users."));
        } else {
            const user_ids = users.map(user => ObjectId(user._id));
            
            // count the number of issues reported by a user
            Issue.aggregate([
                {
                    $match: {
                        user: {$in: user_ids}
                    }
                },
                {
                    $group: {
                        _id: '$user',
                        issuesCount: {
                            $sum: 1
                        }
                    }
                }
            ], function (err, results) {
                const usersJson = users.map(user => user.toJSON());

                // map issues count with the list of users got from DB and 
                results.forEach(function (result) {
                    const resultId = result._id.toString();
                    const correspondingUser = usersJson.find(user => user._id == resultId);
                    correspondingUser.issuesCount = result.issuesCount;
                });
                res.send(usersJson);
            });
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
 * @apiSuccess {Date} User.createdAt Date when the user was created
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
 * @apiSuccess {Date} User.createdAt Date when the user was created
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
 * @apiSuccess {Date} User.createdAt Date when the user was created
 * @apiSuccess {String} User._id User's id
 * @apiSuccess {String} User.firstName First name of the user 
 * @apiSuccess {String} User.lastName Last name of the user 
 * @apiError UserNotDeleted The users could not be deleted.
 */
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
            user_found.remove(function (error) {
                if (error) {
                    return next(error);
                }
                debug(`Deleted user "${user_found.firstName},${user_found.lastName}"`);
                res.sendStatus(204);
            });
        } else {
            res.status(404);
            res.send(app.generateJsonErrorMessage("The user with id " + userId + " could not be found."));
        }
    });
});

exports.getAllUsers = function (callback) {

    var users = User.find({}, function (err, users) {
        if (err) {
            callback(null);
        }
        callback(users);
    });
};

module.exports = router;
