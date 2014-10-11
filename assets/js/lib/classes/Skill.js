/*jslint browser: true*/
/*globals define*/

define(function () {
  'use strict';

  return function Skill(data) {
    this.id = data.id;
    this.name = data.name;
    this.tempName = data.name;
    this.category = data.category;
    this.edit = data.edit || false;
  };
});