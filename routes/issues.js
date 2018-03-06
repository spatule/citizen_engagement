var express = require('express');
var router = express.Router();
var mongoose = require('../app').mangoose;
var app = require('../app');
var Issue = require("../models/issue");
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
router.get('/:issue_id', function(req, res, next) {
  Issue.findOne({"_id": req.params.issue_id}, function (error, issue_found) {
      if (error) {
          res.send(app.generateJsonErrorMessage("The issue with id " + req.params.issue_id + " could not be found."));
      } else {
          res.send(issue_found);
      }
  });
});

router.get('/', function(req, res, next) {
  Issue.find({}, function (error, issues_from_user) {
      if (error) {
          res.send(app.generateJsonErrorMessage("a remplacer mais erreur"));
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
router.delete('/:issue_id', function (req, res, next) {
    const issueId = req.params.issue_id; 
    Issue.findOne({"_id": issueId}, function (error, issue_found) {
        if (error) {
            if (ObjectId.isValid(issueId)) {
                res.send(error);
            } else {
                next(error);
            }
        } else if (issue_found) {
            issue_found.remove(function(error) {
                if (error) {
                    return next(error);
                }
                debug(`Deleted issue "${issue_found.description}"`);
                res.sendStatus(204);
            });
        } else {
            res.status(404);
            res.send(app.generateJsonErrorMessage("The issue with id " + issueId + " could not be found."));
        }
    });
});

module.exports = router;
