/*jslint node: true*/
/*globals Skill, Project, Link, sails*/

/**
 * StaticController
 *
 * @description :: Server-side logic for managing Statics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var mailer = require('../services/mail.js');

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
  },

  gallery: function (req, res) {
    Gallery.find(function (err, images) {
      if (err) {
        console.log(err);
        res.serverError('Error retrieving images');
      } else {
        res.view({
          title: 'Gallery',
          images: images
        });
      }
    });
  },

  contact: function (req, res) {
    var to = sails.config.email.contact.address,
      from = sails.config.email.noreply.address,
      password = sails.config.email.noreply.password,
      subject = 'ScottStadt.com ' + req.param('subject'),
      message = req.param('name') + ' (' + req.param('email') + "): \n\n" + req.param('message');

    mailer.sendMail(to, from, password, subject, message, function (err) {
      if (err) {
        res.serverError('Unable to send mail');
      } else {
        res.json({ success: true });
      }
    });
  }

};

