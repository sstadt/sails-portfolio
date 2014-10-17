/*jslint node: true*/
/*globals Skill, Project, Link, sails*/

/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  portfolio: function (req, res) {
    Skill.find(function (err, skills) {
      if (err) {
        console.log(err);
        res.send(500);
      }

      Project.find({
        limit: sails.config.globals.site.projectFeedLimit
      }, function (err, projects) {
        if (err) {
          console.log(err);
          res.send(500);
        }

        Link.find(function (err, links) {
          if (err) {
            console.log(err);
            res.send(500);
          }

          res.view({
            title: 'Portfolio',
            design: _.filter(skills, function (skill) { return skill.category === 'design'; }),
            development: _.filter(skills, function (skill) { return skill.category === 'development'; }),
            projects: projects,
            links: links
          });

        });
      });
    });
  },

  admin: function (req, res) {
    res.view({
      title: 'Admin'
    });
  }

};

