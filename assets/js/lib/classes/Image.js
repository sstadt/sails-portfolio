/*jslint browser: true*/
/*globals define*/

define(function () {
  'use strict';

  return function Image(data) {
    this.id = data.id;
    this.link = data.link;
  };
});