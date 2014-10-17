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
    Skill.find()
      .then(function (skills) {
        var projects = Project.find().limit(sails.config.globals.site.projectFeedLimit).then(function (projects) {
          return projects;
        });

        return [skills, projects];
      }).spread(function (skills, projects) {
        var links = Link.find().then(function (links) {
          return links;
        });

        res.view({
          title: 'Portfolio',
          skills: skills,
          projects: projects,
          links: links
        });
      }).catch(function (err) {
        console.log(err);
        res.send(500);
      });
  },
  admin: function (req, res) {
    res.view({
      title: 'Admin'
    });
  }
};

