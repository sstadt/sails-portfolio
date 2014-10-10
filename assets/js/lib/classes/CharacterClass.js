/* jslint: true */
/* global define */

/**
 * Class - CharacterClass
 * 
 * Contains data associated with a character class
 * 
 *   name: name of the class
 *   primary: largest statistic
 *   secondary: second largest statistic
 *   tertiary: lowest statistic
 */
  
define(['knockout'], function (ko) {
  'use strict';

  return function CharacterClass(data) {
    var self = this;

    self.name = data.name;
    self.primary = data.primary;
    self.secondary = data.secondary;
    self.tertiary = data.tertiary;
  };
});