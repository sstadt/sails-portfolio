/*jslint node: true*/
/*globals Project, sails*/

/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var aws = require('../services/aws.js'),
  s3path = 'project';

module.exports = {

  start: function (req, res) {
    req.file('file').upload(function (err, file) {
      if (err) {
        res.serverError('Unable to upload file.', err);
      } else {
        aws.upload(file[0], sails.config.s3.bucket, s3path, function (err, url) {
          if (err) {
            res.serverError(err.msg, err.err);
          } else {
            res.json({
              success: true,
              url: url
            });
          }
        });
      }
    });
  },

  create: function (req, res) {
    var newProject = {
      name: req.param('name'),
      link: req.param('link'),
      skills: req.param('skills'),
      description: req.param('description')
    };

    Project.create(newProject, function (err, project) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          project: project
        });
      }
    });
  },

  update: function (req, res) {
    var updatedProject = {
      name: req.param('name'),
      link: req.param('link'),
      skills: req.param('skills'),
      description: req.param('description')
    };

    Project.update(req.param('id'), updatedProject, function (err, project) {
      if (err) {
        res.json(err);
      } else {
        res.jason({
          success: true,
          project: project
        });
      }
    });
  },

  show: function (req, res) {
    Project.find(function (err, projects) {
      if (err) {
        res.json(err);
      } else {
        req.json({
          success: true,
          projects: projects
        });
      }
    });
  },

  destroy: function (req, res) {
    Project.destroy(req.param('id'), function (err) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true
        });
      }
    });
  }

};

