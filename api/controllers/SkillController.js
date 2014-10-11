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
    var newSkill = {
      name: req.param('name'),
      category: req.param('category')
    };

    Skill.create(newSkill, function (err, skill) {
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

