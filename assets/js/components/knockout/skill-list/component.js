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

      console.log(newSkill);

      $.ajax({
        type: 'POST',
        url: '/skill/create',
        dataType: 'json',
        data: newSkill,
        cache: false,
        success: function (response) {
          if (response.success) {
            self[response.skill.category].push(response.skill);

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
      var skillIndex = _.findIndex(self[skill.category](), function (c) {
        return c.id === skill.id;
      });

      skill.edit = true;
      self[skill.category].replace(self[skill.category]()[skillIndex], skill);
      console.log(self[skill.category]());
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

