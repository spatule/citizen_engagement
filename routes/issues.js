var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = require('../app');
var Issue = require("../models/issue");

// Middleware
var findIssueFromParam = function(req, res, next){
  Issue.findOne({"_id": req.params.issue_id}, function (error, issue_found) {
    if (error) {
      if(mongoose.Types.ObjectId.isValid(req.params.issue_id)){
          res.status(500).send(app.generateJsonErrorMessage("Unexpected error with Database"));
      } else {
        res.status(404).send(app.generateJsonErrorMessage("The issue with id " + req.params.issue_id + " could not be found (Id not valid)."));
      }

    } else if(issue_found === null){
      res.status(404).send(app.generateJsonErrorMessage("The issue with id " + req.params.issue_id + " could not be found."));
    }
    else {
    req.issue = issue_found;
    next();
  }
  });
};
/* GET issues listing. */
/**
 * @api {get} /issues/:issue_id Request a issue's information
 * @apiVersion 1.0.0
 * @apiName GetIssue
 * @apiGroup Issue
 * @apiParam {issue_id} id Unique Identifier of the issue
 * @apiSuccess {Object} Issue Issue's informations
 * @apiSuccess {String} Issue.Description Issue's description
 * @apiSuccess {Date} Issue.createdAt Date when the issue was created
 * @apiSuccess {Double} Issue._id Issue's id
 * @apiSuccess {Array} Issue.tags Issue's tags
 * @apiSuccess {String} Issue.imageUrl Path to the issue's image
 * @apiSuccess {Double} Issue.longitude Issue's longitude
 * @apiSuccess {Double} Issue.latitude Issue's latitude
 * @apiSuccess {Double} Issue.user The id of the user that created the issue
 * @apiSuccess {String} Issue.status The status of the issue
 * @apiError IssueNotFound The issue with <code>id</code> could not be found.
 */
router.get('/:issue_id', findIssueFromParam,  function(req, res, next) {
        res.send(req.issue);
});
/**
 * @api {get} /issues?user=:user_id Request the issue's of the user
 * @apiVersion 1.0.0
 * @apiName GetIssuesFromUser
 * @apiGroup Issue
 * @apiParam {String} user id Unique Identifier of the user
 * @apiSuccess {Object} Issue Issue's informations
 * @apiSuccess {String} Issue.Description Issue's description
 * @apiSuccess {Date} Issue.createdAt Date when the issue was created
 * @apiSuccess {Double} Issue._id Issue's id
 * @apiSuccess {Array} Issue.tags Issue's tags
 * @apiSuccess {String} Issue.imageUrl Path to the issue's image
 * @apiSuccess {Double} Issue.longitude Issue's longitude
 * @apiSuccess {Double} Issue.latitude Issue's latitude
 * @apiSuccess {Double} Issue.user The id of the user that created the issue
 * @apiSuccess {String} Issue.status The status of the issue
 * @apiError IssueNotFound The issue with <code>id</code> could not be found.
 */
router.get('/', function(req, res, next) {
  Issue.find({}, function (error, issues_from_user) {
      if (error) {
          res.send(app.generateJsonErrorMessage("The issue with id " + req.query.issue_id + " could not be found."));
      } else {
          var issueMap = {};
          issues_from_user.forEach(function (issue) {
            if(issue.user==req.query.user){
              issueMap[issue._id] = issue;
            }
          });
          res.send(issueMap);
      }
  });
});

router.post('/', function (req, res, next) {
  var issue = new Issue(req.body);
  issue.save(function (error, saved_issue) {
      if (error) {
          res.send(error);
      } else {
          res.send(saved_issue);
      }
  });
});

router.patch('/:issue_id', function (req, res, next) {
    Issue.findByIdAndUpdate(req.params.issue_id, {$set: req.body}, {new : false, runValidators: true}, function (error, issue_updated) {
        if (error) {
            res.send(app.generateJsonErrorMessage("Unable to update the user with ID " + req.params.issue_id));
        } else {
            res.send(issue_updated);
        }
    });
});

router.delete('/:issue_id',  function (req, res, next) {

  Issue.findByIdAndRemove(req.params.issue_id, (err, issue_removed) => {
    // As always, handle any potential errors:
    if (err) return res.status(500).send(err);
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
        message: "Issue successfully deleted",
        id: issue_removed._id
    };
    return res.status(200).send(response);
});
});
module.exports = router;
