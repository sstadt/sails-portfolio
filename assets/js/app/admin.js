/*jslint browser: true*/

require(['knockout'], function (ko) {
  'use strict';

  ko.components.register('skill-list', { require: 'components/knockout/skill-list/component' });

  // apply character list view model to the dom
  ko.applyBindings();
});