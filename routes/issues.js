var express = require('express');
var router = express.Router();
var mongoose = require('../app').mangoose;
var app = require('../app');
var Issue = require("../models/issue");
/* GET issues listing. */
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
router.delete('/:user_id', function (req, res, next) {
  
});

module.exports = router;
