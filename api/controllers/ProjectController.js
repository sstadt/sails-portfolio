/*jslint node: true*/
/*globals Project*/

/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

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

