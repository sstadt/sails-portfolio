/* jslint: true */
/* global define */

/**
 * Class - Character
 * 
 * Contains data associated with a character
 * 
 *   id: database id
 *   name: character name
 *   charClass: character's class
 *   strength: attribute
 *   dexterity: attribute
 *   vitality: attribute
 *   intellect: attribute
 *   bio: short character description
 *   health(computed): adjusted for vitality
 */

define(['knockout', 'statistics'], function (ko, statistics) {
  'use strict';

  return function Character(data) {
    var self = this;

    self.id = data.id;
    self.name = data.name;
    self.charClass = data.charClass;
    self.strength = data.strength;
    self.dexterity = data.dexterity;
    self.vitality = data.vitality;
    self.intellect = data.intellect;
    self.bio = data.bio;

    self.health = ko.computed(function () {
      return statistics.getAdjusted(10, data.vitality);
    });
  };
});