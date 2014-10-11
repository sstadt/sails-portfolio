/*jslint browser: true*/
/*globals define, confirm, alert, io*/

define([
  'jquery',
  'lodash',
  'knockout',
  'Skill',
  'text!./template.html'
], function ($, _, ko, Skill, html) {
  'use strict';

  function SkillListViewModel() {
    // cache this to eliminate the need to pass context to jquery and lodash functions
    var self = this;

    // list data
    self.design = ko.observableArray([]);
    self.development = ko.observableArray([]);

    // new skill data
    self.newDesignSkill = ko.observable();
    self.newDevelopmentSkill = ko.observable();

    /**
     * Add a new skill
     * @param {string} skill    The name of the new skill
     * @param {string} category The skill category: design or development
     */
    self.addSkill = function (skill, category) {
      var newSkill = {
        name: skill,
        category: category
      };

      io.socket.post('/skill/create', newSkill, function (response) {
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
      });
    };

    /**
     * Call the addSkill function with the category
     * set to design
     */
    self.addDesignSkill = function () {
      self.addSkill(self.newDesignSkill(), 'design');
    };

    /**
     * Call the addSkill function with the category
     * set to development
     */
    self.addDevelopmentSkill = function () {
      self.addSkill(self.newDevelopmentSkill(), 'development');
    };

    /**
     * Toggle the edit state of a skill to true
     * @param  {Skill} skill The skill object to turn editing on for
     */
    self.editSkill = function (skill) {
      if (!skill.edit) {
        self.setEditState(skill, true);
      }
    };

    /**
     * Toggle the edit state of a skill to false wthout
     * saving changes
     * @param  {Skill} skill The skill object to turn editing off for
     */
    self.cancelUpdate = function (skill) {
      skill.tempName = skill.name;
      self.setEditState(skill, false);
    };

    /**
     * Set the edit state for a skill
     * @param {Skill} skill The skill object to set edit state for
     * @param {bool}  state The edit state to set; true or false
     */
    self.setEditState = function (skill, state) {
      var skillIndex = _.findIndex(self[skill.category](), function (c) {
        return c.id === skill.id;
      });

      skill.edit = state;
      self[skill.category].replace(self[skill.category]()[skillIndex], self.createSkill(skill));
    };

    /**
     * Save changes to a skill and toggle the edit mode for
     * that skill to false
     * @param {Skill} skill The skill object to save changes for
     */
    self.updateSkill = function (skill) {
      skill.name = skill.tempName;

      io.socket.post('/skill/update', skill, function (response) {
        if (response.success) {
          self.setEditState(response.skill[0], false);
        } else {
          alert('error');
          console.log(response.err);
        }
      });
    };

    /**
     * Delete a skill from the list of skills
     * @param  {Skill} skill the skill to delete from the list
     */
    self.removeSkill = function (skill) {
      if (confirm('Are you sure you want to delete this skill?')) {
        io.socket.post('/skill/destroy', { id: skill.id }, function (response) {
          if (response.success) {
            // update the character list
            self[skill.category].destroy(skill);
          } else {
            alert('error');
            console.log(response);
          }
        });
      }
    };

    /**
     * Slide down jQuery animation binding for skill list items
     * @param  {jQuery} element The element to animate
     */
    self.showSkillElement = function (element) {
      if (element.nodeType === 1) {
        $(element).hide().slideDown();
      }
    };

    /**
     * Slide up jQuery animation binding for skill list items
     * @param  {jQuery} element The element to animate
     */
    self.hideSkillElement = function (element) {
      if (element.nodeType === 1) {
        $(element).slideUp(function () {
          $(element).remove();
        });
      }
    };

    /**
     * Wrapper function for returning a new skill object; abstracted
     * out to allow for more terse mapping on arrays of skills
     * @param  {object} skill The object to instantiate a new Skill with
     * @return {Skill}        The new Skill object
     */
    self.createSkill = function (skill) {
      return new Skill(skill);
    };

    // poplate the initial list of skills
    io.socket.get('/skill/show', function (response) {
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
    });

  } /* End of View Model */

  return {
    viewModel: SkillListViewModel,
    template: html
  };
});

