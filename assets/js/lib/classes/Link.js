/*jslint browser: true*/
/*globals define*/

define(function () {
  'use strict';

  return function Link(data) {
    this.id = data.id;
    this.name = data.name;
    this.caption = data.caption;
    this.link = data.link;
  };
});