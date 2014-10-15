/*jslint browser: true*/
/*globals define*/

define(function () {
  'use strict';

  return function Project(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.skills = data.skills;
    this.link = data.link;
    this.description = data.description;
  };
});