/*jslint node: true*/
/*globals Skill*/

/**
 * SkillController
 *
 * @description :: Server-side logic for managing Skills
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  
  create: function (req, res) {
    Skill.create({ name: req.param('name') }, function (err, skill) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          skill: skill
        });
      }
    });
  },

  update: function (req, res) {
    var updatedSkill = {
      name: req.param('name'),
    };

    if (req.param('highlight')) {
      updatedSkill.highlight = req.param('highlight');
    }

    Skill.update(req.param('id'), updatedSkill, function (err, skill) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          skill: skill
        });
      }
    });
  },

  show: function (req, res) {
    Skill.find(function (err, skills) {
      if (err) {
        res.json(err);
      } else {
        res.json({
          success: true,
          skills: skills
        });
      }
    });
  },

  destroy: function (req, res) {
    Skill.destroy(req.param('id'), function (err, skill) {
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

