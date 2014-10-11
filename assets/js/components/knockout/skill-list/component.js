/*jslint browser: true*/
/*globals define, confirm, alert*/

define([
  'jquery',
  'lodash',
  'knockout',
  'Skill',
  'text!./template.html'
], function ($, _, ko, Skill, html) {
  'use strict';

  function SkillListViewModel() {
    // cache this to avoid conflicts later
    var self = this;

    // list data
    self.design = ko.observableArray([]);
    self.development = ko.observableArray([]);

    // new skill data
    self.newDesignSkill = ko.observable();
    self.newDevelopmentSkill = ko.observable();

    self.addSkill = function (skill, category) {
      var newSkill = {
        name: skill,
        category: category
      };

      $.ajax({
        type: 'POST',
        url: '/skill/create',
        dataType: 'json',
        data: newSkill,
        cache: false,
        success: function (response) {
          if (response.success) {
            self[response.skill.category].push(self.createSkill(response.skill));

            if (category === 'design') {
              self.newDesignSkill('');
            } else {
              self.newDevelopmentSkill('');
            }
          } else {
            alert('error');
            console.log(response);
          }
        }
      });
    };

    self.addDesignSkill = function () {
      self.addSkill(self.newDesignSkill(), 'design');
    };

    self.addDevelopmentSkill = function () {
      self.addSkill(self.newDevelopmentSkill(), 'development');
    };

    self.editSkill = function (skill) {
      if (!skill.edit) {
        self.setEditState(skill, true);
      }
    };

    self.cancelUpdate = function (skill) {
      skill.tempName = skill.name;
      self.setEditState(skill, false);
    };

    self.setEditState = function (skill, state) {
      var skillIndex = _.findIndex(self[skill.category](), function (c) {
        return c.id === skill.id;
      });

      skill.edit = state;
      self[skill.category].replace(self[skill.category]()[skillIndex], self.createSkill(skill));
    };

    self.updateSkill = function (skill) {
      skill.name = skill.tempName;

      $.ajax({
        type: 'POST',
        url: '/skill/update',
        dataType: 'json',
        data: skill,
        cache: false,
        success: function (response) {
          if (response.success) {
            self.setEditState(response.skill[0], false);
          } else {
            alert('error');
            console.log(response.err);
          }
        }
      });
    };

    self.removeSkill = function (skill) {
      if (confirm('Are you sure you want to delete this skill?')) {
        // delete the character from sails
        $.ajax({
          type: 'POST',
          url: '/skill/destroy',
          dataType: 'json',
          data: { id: skill.id },
          cache: false,
          success: function (response) {
            if (response.success) {
              // update the character list
              self[skill.category].destroy(skill);
            } else {
              alert('error');
              console.log(response);
            }
          }
        });
      }
    };

    self.showSkillElement = function (element) {
      if (element.nodeType === 1) {
        $(element).hide().slideDown();
      }
    };

    self.hideSkillElement = function (element) {
      if (element.nodeType === 1) {
        $(element).slideUp(function () {
          $(element).remove();
        });
      }
    };

    self.createSkill = function (skill) {
      return new Skill(skill);
    };

    $.ajax({
      type: 'GET',
      url: '/skill/show',
      dataType: 'json',
      cache: false,
      success: function (response) {
        if (response.success) {
          if (response.skills.length > 0) {
            var design = _.filter(response.skills, function (skill) {
                return skill.category === 'design';
              }).map(self.createSkill),
              development = _.filter(response.skills, function (skill) {
                return skill.category === 'development';
              }).map(self.createSkill);

            self.design(design);
            self.development(development);
          }
        } else {
          alert('error');
          console.log(response);
        }
      }
    });

  } /* End of View Model */

  return {
    viewModel: SkillListViewModel,
    template: html
  };
});

