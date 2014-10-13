/*jslint browser: true*/
/*globals define, alert, confirm*/

/**
 * Character Creater Component
 *
 * Encapculates the character creation component of the
 * character tracker page.
 */

define([
  'jquery',
  'knockout',
  'statistics',
  'Character',
  'CharacterClass',
  'text!./template.html'
], function ($, ko, statistics, Character, CharacterClass, html) {
  'use strict';

  function CharacterCreaterViewModel(params) {
    // cache this to prevent potential conflicts
    var self = this;

    /**
     * Master character list
     *
     * By setting this to the passed in cahracter list parameter,
     * this component's character list becomes linked with the
     * parent component's character list, so any updates we make here
     * (i.e. adding a new character) will be reflected in the parent
     * component.
     */
    self.characters = params.characterList;

    // class data
    self.classes = ko.observableArray([]);
    self.classOptions = ko.observableArray([]);

    // new character data
    self.newCharacterName = ko.observable();
    self.newCharacterClass = ko.observable();
    self.newCharacterStrength = ko.observable(statistics.getDefaultStat());
    self.newCharacterDexterity = ko.observable(statistics.getDefaultStat());
    self.newCharacterVitality = ko.observable(statistics.getDefaultStat());
    self.newCharacterIntellect = ko.observable(statistics.getDefaultStat());
    self.newCharacterBiography = ko.observable();

    /**
     * Set the character class for a new character.
     *
     * Updates the statistics based on the selected character
     * class and it's corresponding statistic bonuses
     */
    self.setNewCharacterClass = function () {
      // find the selected character class details based on the current data-bind value
      var selectedClass = _.find(self.classes(), function (c) {
          return c.name === self.newCharacterClass();
        });

      // update the statistic data bindings based on the selected class
      self.newCharacterStrength(statistics.getClassBonus('strength', selectedClass, self.bonuses) + statistics.getDefaultStat());
      self.newCharacterDexterity(statistics.getClassBonus('dexterity', selectedClass, self.bonuses) + statistics.getDefaultStat());
      self.newCharacterVitality(statistics.getClassBonus('vitality', selectedClass, self.bonuses) + statistics.getDefaultStat());
      self.newCharacterIntellect(statistics.getClassBonus('intellect', selectedClass, self.bonuses) + statistics.getDefaultStat());
    };

    /**
     * Add a new character
     *
     * After an ajax call to the back-end, adds the new character
     * to the master character list, which is bound to the parent
     * compnent's character list, triggering an automatic update
     * in the character list parent component.
     */
    self.addCharacter = function () {
      // marshall data
      var newChar = {
          name: self.newCharacterName(),
          charClass: self.newCharacterClass(),
          strength: self.newCharacterStrength(),
          dexterity: self.newCharacterDexterity(),
          vitality: self.newCharacterVitality(),
          intellect: self.newCharacterIntellect(),
          bio: self.newCharacterBiography()
        };

      $.ajax({
        type: 'POST',
        url: '/character/create',
        dataType: 'json',
        data: newChar,
        cache: false,
        success: function (response) {
          if (response.success) {
            // add the new character to the master character list
            self.characters.push(new Character(response.character));

            // reset the new character parameters
            self.newCharacterName('');
            self.newCharacterClass('');
            self.newCharacterStrength(statistics.getDefaultStat());
            self.newCharacterDexterity(statistics.getDefaultStat());
            self.newCharacterVitality(statistics.getDefaultStat());
            self.newCharacterIntellect(statistics.getDefaultStat());
            self.newCharacterBiography('');
          } else {
            alert('error');
            console.log(response.error);
          }
        }
      });
    };

    // populate initial class data
    $.ajax({
      type: 'GET',
      url: '/static/classes',
      dataType: 'json',
      cache: false,
      success: function (response) {
        if (response.success) {
          var mappedClasses = $.map(response.classes, function (c) {
            return new CharacterClass(c);
          });

          self.classes(mappedClasses);
          self.classOptions(mappedClasses.map(function (c) {
            return c.name;
          }));

          self.bonuses = response.bonuses;
        } else {
          alert('error getting classes');
          console.log(response);
        }
      }
    });

  } /* End of View Model */

  return {
    viewModel: CharacterCreaterViewModel,
    template: html
  };
});

